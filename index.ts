import { DoubledeleteTS, doubledb } from "./doubledelete_ts/doubledelete";

import { helloCommand } from "./commands/hello";
import { echoCommand } from "./commands/echo";
import { Client } from "discord.js";
import { makeNoteCommand } from "./commands/makenote";
import { getNotesCommand } from "./commands/getnotes";
import { buttonCommand } from "./commands/button";

const PROD = '1149177279168139334'; // dbft
const TEST = '1150109878745038880'; // dbft2

let d = new DoubledeleteTS(".secrets.json");
d.onStartup((client: Client) => {
  doubledb.run(`CREATE TABLE IF NOT EXISTS notes ( id INTEGER PRIMARY KEY AUTOINCREMENT, text VARCHAR(256) )`)
  console.log("Here we go");
});
d.addGlobalCommand(new helloCommand());
d.addGlobalCommand(new makeNoteCommand());
d.addGlobalCommand(new getNotesCommand());
d.addGlobalCommand(new buttonCommand());
d.addGuildCommand(new echoCommand(), TEST);
d.run();
