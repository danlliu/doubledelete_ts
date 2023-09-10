import { Client, CacheType } from "discord.js";
import { Command, CommandInteraction, CommandStringParameter, Subcommand } from "../doubledelete_ts/doubledelete";

class subcommandOne extends Subcommand {
  constructor() {
    super("one", "First subcommand", []);
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    await interaction.reply("one?");
  }
}

class subcommandTwo extends Subcommand {
  constructor() {
    super("two", "Second subcommand", []);
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    await interaction.reply("two!");
  }
}

class subcommandThree extends Subcommand {
  constructor() {
    super("three", "Third subcommand", [
      new CommandStringParameter("mystring", "A string", true)
    ]);
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    await interaction.reply(`three!!! you gave me the string ${parameters.get('mystring')}`);
  }
}

export class subcommandCommand extends Command {
  constructor() {
    super("subcommand", "Subcommand test", [
      new subcommandOne(),
      new subcommandTwo(),
      new subcommandThree(),
    ])
  }
}
