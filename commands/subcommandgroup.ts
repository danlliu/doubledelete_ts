import { Client, CacheType } from "discord.js";
import { Command, CommandIntegerParameter, CommandInteraction, CommandStringParameter, Subcommand, SubcommandGroup } from "../doubledelete_ts/doubledelete";

export class subgroupCommand extends Command {
  constructor() {
    super("subgroup", "Subcommand group test", [
      new SubcommandGroup("groupone", "First subcommand group", [
        new Subcommand("one", "Group one first subcommand", []),
        new Subcommand("two", "Group one second subcommand", []),
        new Subcommand("three", "Group one third subcommand", [
          new CommandStringParameter("param", "A string", true)
        ]),
      ]),
      new SubcommandGroup("grouptwo", "Second subcommand group", [
        new Subcommand("one", "Group two first subcommand", []),
        new Subcommand("two", "Group two second subcommand", []),
        new Subcommand("three", "Group two third subcommand", [
          new CommandIntegerParameter("param", "An integer", true)
        ]),
      ]),
    ])
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    if (this.isSubcommandGroup(interaction, "groupone")) {
      if (this.isSubcommand(interaction, "one")) {
        await interaction.reply("one?");
      } else if (this.isSubcommand(interaction, "two")) {
        await interaction.reply("two!");
      } else if (this.isSubcommand(interaction, "three")) {
        await interaction.reply(`three!!! you gave me the string ${parameters.get('param')}`);
      }
    }
    else if (this.isSubcommandGroup(interaction, "grouptwo")) {
      if (this.isSubcommand(interaction, "one")) {
        await interaction.reply("ONE?");
      } else if (this.isSubcommand(interaction, "two")) {
        await interaction.reply("TWO!");
      } else if (this.isSubcommand(interaction, "three")) {
        await interaction.reply(`THREE!!! you gave me the integer ${parameters.get('param')}`);
      }
    }
  }
}
