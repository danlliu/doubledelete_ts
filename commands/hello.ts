
import { Client, CommandInteraction, Message } from "discord.js";
import { Command } from "../doubledelete_ts/doubledelete";

export class helloCommand extends Command {
  constructor() {
    super("hello", "says hello", []);
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    await interaction.reply("hello world");
  }
}
