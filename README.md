# doubledelete.ts

A TypeScript Discord bot framework, made to simplify slash command and interaction management.

## Why doubledelete.ts?

I wanted to create a framework that seamlessly manages slash commands, without weird file system dependencies. Additionally, I wanted to easily support stateful operations by adding database integration.

## Usage

Clone down this repository, and then modify the [`/commands`](commands/) directory to add your commands!

## Setting Up `index.ts`

The most basic `index.ts` is:

```typescript
import { DoubledeleteTS } from "./doubledelete_ts/doubledelete";

let d = new DoubledeleteTS(".secrets.json");
d.run();
```

This initializes a new driver with token from `.secrets.json`, and starts it. Check out [`.secrets.json.template`](.secrets.json.template) for the format of `.secrets.json`.

If you want to add custom startup logic (ex. logging, setting the bot's status, etc.), you can set up a custom startup handler that is run after all commands are registered:

```typescript
d.onStartup((client: Client) => {
  // your code here
});
```

## API Documentation

### Creating and adding a command

Let's start with the basics: creating a new command. To do so, there are two things that need to happen:

1. Create your command's class, which `extends Command`. The code will likely look something like this:

```typescript
import { Command } from "../doubledelete_ts/doubledelete";

export class myCommand extends Command {
  constructor() {
    super("command", "Description of the command", [/* parameters if any */]);
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    // your code here
  }
}
```

2. Register your command in the driver. In this case, we'll update `main.ts`:

```typescript
import { myCommand } from "./commands/mycommand";

let d = new DoubledeleteTS(".secrets.json");
d.addGlobalCommand(new myCommand());
d.run();
```

From here, `doubledelete.ts` will take care of everything else, and register the command! You can also register it as a guild-specific command by using `addGuildCommand`:

```typescript
import { myCommand } from "./commands/mycommand";

let d = new DoubledeleteTS(".secrets.json");
d.addGuildCommand(new myCommand(), "my_guild_id");
d.run();
```

### Adding parameters

To add parameters to a command, we can put them into the `super` constructor call. We can create any `CommandParameter` type defined in [`Command.ts`](./doubledelete_ts/Command.ts). Let's take a look at a simple echo command:

```typescript
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
```

Notice that `doubledelete.ts` automatically parses the parameters for us! Thus, we can look them up directly in `parameters`.

### Using subcommands and subcommand groups

To add subcommands and subcommand groups, we can simply add those to the array as well. Note that a command can only have children of one type: either parameters, subcommands, or subcommand groups. Let's take a look at an example of using subcommands ([`subcommand.ts`](./commands/subcommand.ts)):

```typescript
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
```

Notice that the definition of `Subcommand` is very similar to defining a `Command`: this is intentional! `Command` also provides an `isSubcommand` (and `isSubcommandGroup`) function to dtermine which branch of a command is being used. Notice that parameters are automatically extracted if necessary.

### Using the database

`doubledelete.ts` provides access to a SQLite3 database via the global `doubledb` object. `doubledb` provides two functions:

- `run`: run a SQL command, without capturing output. This is typically used for commands such as `CREATE TABLE` where we don't care about the output.
- `select`: run a SQL command, and capture the output in an `Array`. This is typically used for commands such as `SELECT` where we want to utilize the output.

For an example of how to use this, we can look at [`getnotes`](./commands/getnotes.ts):

```typescript
  constructor() {
    super("getnotes", "gets all saved notes", []);
    doubledb.run(`CREATE TABLE IF NOT EXISTS notes ( id INTEGER PRIMARY KEY AUTOINCREMENT, text VARCHAR(256) )`)
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    let notes: Array<any> = await doubledb.select(`SELECT * FROM notes`);
    console.log(notes.at(0).text);
    let contents = '# Notes:\n' + notes.map((note) => `- [${note.id}] ${note.text}`).reduce((a, b) => a + '\n' + b, '');
    interaction.reply(contents);
  }
```

Here, we can just execute a simple query, and directly access the result as an `Array`. We also see the `run` function being used to initialize the table if it does not exist.

### Handling Interactions

For applications such as role buttons or minigames, developers often want to handle interactions globally. `doubledelete.ts` provides a framework to easily register interactions. Let's take a look at [`button.ts`](./commands/button.ts) as an example:

```typescript
  constructor() {
    super("button", "a command with a button", [])
  }

  setupInteractions(manager: InteractionManager): void {
    manager.on(this.interaction("click"), async (interaction: Interaction) => {
      let button = interaction as ButtonInteraction;
      await button.channel?.send("hello!");
      button.deferUpdate();
    });
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    const send = new ButtonBuilder()
      .setCustomId(this.interaction("click"))
      .setLabel("Click me!")
      .setStyle(ButtonStyle.Primary)
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(send);
    await interaction.reply({
      components: [row]
    });
  }
```

To register interactions, `Command` provides a function `setupInteractions`, which allows the command to register all interactions it may need to handle. Notice that the syntax is very similar to `Client`'s callback setup.

Additionally, to avoid naming conflicts, `doubledelete.ts` provides the `this.interaction` function, which performs very light name mangling to add the command name as a prefix to the interaction name. Thus, two commands could both define a `"click"` interaction without leading to name conflicts.
