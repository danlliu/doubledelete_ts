import { Client, CommandInteraction, CacheType, ActionRowBuilder, ButtonBuilder, Interaction, ButtonStyle, ButtonInteraction } from "discord.js";
import { Command, CommandStringParameter } from "../doubledelete_ts/Command";
import { InteractionManager } from "../doubledelete_ts/InteractionManager";

export class buttonCommand extends Command {
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
}
