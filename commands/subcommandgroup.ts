import { Client, CacheType } from "discord.js";
import { Command, CommandIntegerParameter, CommandInteraction, CommandStringParameter, Subcommand, SubcommandGroup } from "../doubledelete_ts/doubledelete";

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
      new CommandStringParameter("param", "A string", true)
    ]);
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    await interaction.reply(`three!!! you gave me the string ${parameters.get('param')}`);
  }
}

class subcommandOne2 extends Subcommand {
  constructor() {
    super("one", "First subcommand", []);
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    await interaction.reply("One?");
  }
}

class subcommandTwo2 extends Subcommand {
  constructor() {
    super("two", "Second subcommand", []);
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    await interaction.reply("Two!");
  }
}

class subcommandThree2 extends Subcommand {
  constructor() {
    super("three", "Third subcommand", [
      new CommandIntegerParameter("param", "An integer", true)
    ]);
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    await interaction.reply(`Three!!! you gave me the integer ${parameters.get('param')}`);
  }
}

export class subgroupCommand extends Command {
  constructor() {
    super("subgroup", "Subcommand group test", [
      new SubcommandGroup("groupone", "First subcommand group", [
        new subcommandOne(),
        new subcommandTwo(),
        new subcommandThree()
      ]),
      new SubcommandGroup("grouptwo", "Second subcommand group", [
        new subcommandOne2(),
        new subcommandTwo2(),
        new subcommandThree2()
      ]),
    ])
  }
}
