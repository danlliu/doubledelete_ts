
/**
 * A class that handles command registration, dispatch, and registration/deregistration
 */

import { Command } from "./Command";

export class CommandManager {
  globalCommands: Array<Command>;
  guildCommands: Map<string, Array<Command>>;

  constructor() {
    this.globalCommands = [];
    this.guildCommands = new Map();
  }
  addGlobalCommand(command: Command) {
    this.globalCommands.push(command);
  }
  addGuildCommand(command: Command, guildID: string) {
    if (!this.guildCommands.has(guildID)) this.guildCommands.set(guildID, []);
    this.guildCommands.get(guildID)!.push(command);
  }
}
