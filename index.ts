import { DoubledeleteTS } from "./doubledelete_ts/doubledelete";

import { helloCommand } from "./commands/hello";
import { echoCommand } from "./commands/echo";
import { Client } from "discord.js";
import { makeNoteCommand } from "./commands/makenote";
import { getNotesCommand } from "./commands/getnotes";
import { buttonCommand } from "./commands/button";
import { subcommandCommand } from "./commands/subcommand";
import { subgroupCommand } from "./commands/subcommandgroup";

const PROD = '1149177279168139334'; // dbft
const TEST = '1150109878745038880'; // dbft2

let d = new DoubledeleteTS(".secrets.json");
d.onStartup((client: Client) => {
  console.log("Here we go");
});
d.addGlobalCommand(new helloCommand());
d.addGlobalCommand(new makeNoteCommand());
d.addGlobalCommand(new getNotesCommand());
d.addGlobalCommand(new buttonCommand());
d.addGlobalCommand(new subcommandCommand());
d.addGlobalCommand(new subgroupCommand());
d.addGuildCommand(new echoCommand(), TEST);
d.run();
