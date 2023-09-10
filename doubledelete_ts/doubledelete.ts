
import * as fs from "fs";

import { CommandManager } from "./CommandManager";
import { Command, CommandParameter, CommandAttachmentParameter, CommandBooleanParameter, CommandChannelParameter, CommandIntegerParameter, CommandMentionableParameter, CommandNumberParameter, CommandRoleParameter, CommandStringParameter, CommandUserParameter } from "./Command";
import { BaseInteraction, ButtonInteraction, Client, CommandInteraction, GatewayIntentBits, Interaction } from "discord.js";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { InteractionManager } from "./InteractionManager";
export { 
  Command, 

  CommandParameter,
  CommandAttachmentParameter,
  CommandBooleanParameter,
  CommandChannelParameter,
  CommandIntegerParameter,
  CommandInteraction,
  CommandMentionableParameter,
  CommandNumberParameter,
  CommandRoleParameter,
  CommandStringParameter,
  CommandUserParameter,

  InteractionManager 
};

export class DoubledeleteTS {
  commandManager: CommandManager;
  interactionManager: InteractionManager;

  token: string;
  appid: string;

  startupHandler: (client: Client) => void;

  constructor(secretsFile: string) {
    let secrets = JSON.parse(fs.readFileSync(secretsFile).toString());
    this.commandManager = new CommandManager();
    this.interactionManager = new InteractionManager();
    this.token = secrets["token"];
    this.appid = secrets["appid"];
    this.startupHandler = (_: Client) => {};
  }

  onStartup(handler: (client: Client) => void) {
    this.startupHandler = handler;
    return this;
  }

  addGlobalCommand(command: Command) {
    this.commandManager.addGlobalCommand(command);
    return this;
  }

  addGuildCommand(command: Command, guildid: string) {
    this.commandManager.addGuildCommand(command, guildid);
    return this;
  }

  validateCommands() {
    // 1. Global commands cannot conflict with each other
    let globalCommandNames: Set<string> = new Set();
    for (let globalCommand of this.commandManager.globalCommands) {
      if (globalCommandNames.has(globalCommand.name)) {
        console.error(`Error: global command ${globalCommand.name} appears multiple times, with potentially conflicting definitions`);
        process.exit(1);
      }
      globalCommandNames.add(globalCommand.name);
    }
    // 2. Guild commands cannot conflict with other commands in the same guild
    // 3. Guild commands cannot conflict with global commands
    for (let guildID of this.commandManager.guildCommands.keys()) {
      let guildCommandNames: Set<string> = new Set();
      for (let guildCommand of this.commandManager.guildCommands.get(guildID)!) {
        // (2)
        if (guildCommandNames.has(guildCommand.name)) {
          console.error(`Error: guild command ${guildCommand.name} appears multiple times in guild ${guildID}, with potentially conflicting definitions`);
          process.exit(1);
        }
        // (3)
        if (globalCommandNames.has(guildCommand.name)) {
          console.error(`Error: guild command ${guildCommand.name} appears in guild ${guildID}, as well in the global scope, with potentially conflicting definitions`);
          process.exit(1);
        }

        guildCommandNames.add(guildCommand.name);
      }
    }
  }

  run() {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
      ]
    });
    client.login(this.token)

    process.on('SIGINT', function() {
      console.log("\nSIGINT received... cleaning up Discord instance and doubleDB");
      client.destroy();
      doubledb.db.close();
      process.exit(0);
    });

    client.on('ready', async () => {
      this.validateCommands();
      // Register commands
      {
        //
        // Global commands
        //

        console.log(`Setting up global interactions`);
        for (let command of this.commandManager.globalCommands) {
          command.setupInteractions(this.interactionManager);
        }

        await client.application?.commands.set(this.commandManager.globalCommands.map((x: Command) => x.builder()));
        console.log(`Registering ${this.commandManager.globalCommands.length} global commands`);
        
        //
        // Guild commands
        //
        const db = new Database("./doubledelete_ts/db/guilds.sqlite3", OPEN_READWRITE | OPEN_CREATE);
        let guilds: Set<string> = new Set();

        await db.run(`CREATE TABLE IF NOT EXISTS guilds ( id VARCHAR(256) PRIMARY KEY )`);

        let promise = new Promise((res, rej) => {
          db.each(`SELECT id FROM guilds`, [], (err, row: any) => {
            if (err) {
              throw err;
            }
            guilds.add(row.id);
          }, () => {
            res(0);
          });
        });
        await promise;

        await db.run(`DELETE FROM guilds`);

        for (let guild of this.commandManager.guildCommands.keys()) {
          guilds.add(guild);
        }

        for (let guildID of guilds) {
          let guild = await client.guilds.fetch(guildID);

          console.log(`Setting up interactions for guild "${guild}" (id ${guildID})`)
          this.interactionManager.setContext(guildID);
          for (let command of this.commandManager.guildCommands.get(guildID)!) {
            command.setupInteractions(this.interactionManager);
          }

          if (this.commandManager.guildCommands.has(guildID)) {
            console.log(`Registering ${this.commandManager.guildCommands.get(guildID)!.length} guild commands to guild "${guild}" (id ${guildID})`);
            await guild.commands.set(this.commandManager.guildCommands.get(guildID)!.map((x: Command) => x.builder()));
            await db.run(`INSERT INTO guilds VALUES (?)`, {1: guildID});
          } else {
            console.log(`Found guild "${guild}" (${guildID}) with no commands`);
            await guild.commands.set([]);
          }
        }

        db.close();
      }

      this.startupHandler(client);
    });

    client.on('interactionCreate', async (interaction: BaseInteraction) => {
      if (interaction.isCommand()) {
        // Slash commands
        let commandInteraction = interaction as CommandInteraction;
        // Look through registered commands and fire handlers
        // 1. Check global commands
        for (let command of this.commandManager.globalCommands) {
          if (command.name == interaction.commandName) {
            command.handler(client, commandInteraction);
            return;
          }
        }
        // 2. Check guild commands
        let guildID = interaction.guildId;
        if (guildID && this.commandManager.guildCommands.has(guildID)) {
          for (let command of this.commandManager.guildCommands.get(guildID)!) {
            if (command.name == interaction.commandName) {
              command.handler(client, commandInteraction);
              return;
            }
          }
        }
      } // if (isCommand)
      else if (interaction.isButton()) {
        // Interaction
        // 1. Check global interactions
        for (let [name, handler] of this.interactionManager.globalInteractions) {
          if (name == (interaction as ButtonInteraction).customId) {
            handler(interaction);
            return;
          }
        }
        // 2. Check guild interactions
        let guildID = interaction.guildId;
        if (guildID && this.commandManager.guildCommands.has(guildID)) {
          for (let [name, handler] of this.interactionManager.guildInteractions.get(guildID)!) {
            if (name == (interaction as ButtonInteraction).customId) {
              handler(interaction);
              return;
            }
          }
        }
      } // else if (isButton || isStringSelectMenu)
    });
  }
}

class DoubleDB {
  db: Database

  constructor(filename: string) {
    this.db = new Database(filename, OPEN_READWRITE | OPEN_CREATE);
  }

  run(query: string, ...args: any[]) {
    let promise = new Promise((res, _) => {
      this.db.run(query, ...args, () => {res(0);});
    });
    return promise;
  }

  select(query: string, ...args: any[]) : Promise<Array<any>> {
    let promise = new Promise<Array<any>>((res, rej) => {
      this.db.all(query, ...args, (err: any, rows: Array<any>) => {
        if (err) {
          rej(err);
        } else {
          res(rows);
        }
      })
    });
    return promise;
  }
};

export const doubledb = new DoubleDB("./doubledelete_ts/db/doubledb.sqlite3");
