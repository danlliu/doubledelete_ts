import { Client, CommandInteraction, CacheType } from "discord.js";
import { Command } from "../doubledelete_ts/Command";
import { doubledb } from "../doubledelete_ts/doubledelete";

export class getNotesCommand extends Command {
  constructor() {
    super("getnotes", "gets all saved notes", []);
  }

  async execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {
    let notes: Array<any> = await doubledb.select(`SELECT * FROM notes`);
    console.log(notes.at(0).text);
    let contents = '# Notes:\n' + notes.map((note) => `- [${note.id}] ${note.text}`).reduce((a, b) => a + '\n' + b, '');
    interaction.reply(contents);
  }
}
