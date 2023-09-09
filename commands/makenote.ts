import { Client, CommandInteraction, CacheType } from "discord.js";
import { Command, CommandStringParameter } from "../doubledelete_ts/Command";
import { doubledb } from "../doubledelete_ts/doubledelete";

export class makeNoteCommand extends Command {
  constructor() {
    super("makenote", "makes a new note", [
      new CommandStringParameter("content", "The note content", true, 0, 256)
    ]);
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    console.log(await doubledb.select(`INSERT INTO notes (text) VALUES (?)`, parameters.get("content")));
    interaction.reply("note created");
  }
}
