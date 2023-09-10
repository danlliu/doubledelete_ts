
/**
 * A class that handles non-slash command interactions
 */

import { Interaction } from "discord.js";

export class InteractionManager {
  globalInteractions: Map<string, (interaction: Interaction) => void>;
  guildInteractions: Map<string, Map<string, (interaction: Interaction) => void>>;

  currentGuild: string|null = null;

  constructor() {
    this.globalInteractions = new Map();
    this.guildInteractions = new Map();
  }

  setContext(guild: string|null) {
    this.currentGuild = guild;
  }

  on(interactionName: string, handler: (interaction: Interaction) => void) {
    console.log(`Adding interaction "${interactionName}"`);
    if (this.globalInteractions.has(interactionName)) {
      console.error(`Interaction ${interactionName} being added multiple times with potentially conflicting handlers.`);
      process.exit(1);
    }
    if (this.currentGuild && !this.guildInteractions.has(this.currentGuild)) {
      this.guildInteractions.set(this.currentGuild, new Map());
    }
    if (this.currentGuild && this.guildInteractions.get(this.currentGuild)!.has(interactionName)) {
      console.error(`Interaction ${interactionName} being added multiple times in the same guild (${this.currentGuild}) with potentially conflicting handlers.`);
      process.exit(1);
    }
    if (this.currentGuild) {
      this.guildInteractions.get(this.currentGuild)!.set(interactionName, handler);
    } else {
      this.globalInteractions.set(interactionName, handler);
    }
  }
}
