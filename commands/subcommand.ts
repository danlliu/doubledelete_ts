import { Client, CacheType } from "discord.js";
import { Command, CommandInteraction, CommandStringParameter, Subcommand } from "../doubledelete_ts/doubledelete";

export class subcommandCommand extends Command {
  constructor() {
    super("subcommand", "Subcommand test", [
      new Subcommand("one", "First subcommand", []),
      new Subcommand("two", "Second subcommand", []),
      new Subcommand("three", "Third subcommand", [
        new CommandStringParameter("mystring", "A string", true)
      ]),
    ])
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    if (this.isSubcommand(interaction, "one")) {
      await interaction.reply("one?");
    } else if (this.isSubcommand(interaction, "two")) {
      await interaction.reply("two!");
    } else if (this.isSubcommand(interaction, "three")) {
      await interaction.reply(`three!!! you gave me the string ${parameters.get('mystring')}`);
    }
  }
}
