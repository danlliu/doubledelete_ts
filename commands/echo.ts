import { Client, CommandInteraction, Message } from "discord.js";
import { Command, CommandStringParameter } from "../doubledelete_ts/Command";

export class echoCommand extends Command {
  constructor() {
    super("echo", "sends back the message", [
      new CommandStringParameter("message", "the message to echo", true)
    ]);
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    await interaction.reply(parameters.get('message'));
  }
}
