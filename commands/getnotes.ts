import { Client, CommandInteraction, CacheType } from "discord.js";
import { Command, doubledb } from "../doubledelete_ts/doubledelete";

export class getNotesCommand extends Command {
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
}
