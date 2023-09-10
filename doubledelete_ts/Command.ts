import { CacheType, ChannelType, Client, CommandInteraction, Message, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandUserOption } from "discord.js"
import { InteractionManager } from "./InteractionManager";

export enum CommandParameterType {
  String,
  Integer,
  Number,
  Boolean,

  User,
  Channel,
  Role,
  Mentionable,

  Attachment,
}

export class CommandParameter {
  type: CommandParameterType;
  name: string;
  description: string;
  required: boolean = false;

  constructor(type: CommandParameterType, name: string, description: string, required: boolean=false) {
    this.type = type;
    this.name = name;
    this.description = description;
    this.required = required;
  }

  addToBuilder(builder: SlashCommandBuilder) {
  }

  getOptionValue(interaction: CommandInteraction): any {
  }
}

export class CommandStringParameter extends CommandParameter {
  minLength: number|undefined;
  maxLength: number|undefined;
  constructor(name: string, description: string, required: boolean=false, minLength: number|undefined=undefined, maxLength: number|undefined=undefined) {
    super(CommandParameterType.String, name, description, required);
    this.minLength = minLength;
    this.maxLength = maxLength;
  }

  addToBuilder(builder: SlashCommandBuilder) {
    builder.addStringOption(option => {
      option.setName(this.name);
      option.setDescription(this.description );
      option.setRequired(this.required);
      if (this.minLength) option.setMinLength(this.minLength);
      if (this.maxLength) option.setMaxLength(this.maxLength);
      return option;
    })
  }

  getOptionValue(interaction: CommandInteraction<CacheType>): any {
    return interaction.options.get(this.name)?.value as string|null;
  }
}

export class CommandIntegerParameter extends CommandParameter {
  minValue: number|undefined;
  maxValue: number|undefined;
  constructor(name: string, description: string, required: boolean=false, minValue: number|undefined=undefined, maxValue: number|undefined=undefined) {
    super(CommandParameterType.Integer, name, description, required);
    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  addToBuilder(builder: SlashCommandBuilder) {
    builder.addIntegerOption(option => {
      option.setName(this.name);
      option.setDescription(this.description );
      option.setRequired(this.required);
      if (this.minValue) option.setMinValue(this.minValue);
      if (this.maxValue) option.setMaxValue(this.maxValue);
      return option;
    })
  }

  getOptionValue(interaction: CommandInteraction<CacheType>): any {
    return interaction.options.get(this.name)?.value as number|null;
  }
}

export class CommandNumberParameter extends CommandParameter {
  minValue: number|undefined;
  maxValue: number|undefined;
  constructor(name: string, description: string, required: boolean=false, minValue: number|undefined=undefined, maxValue: number|undefined=undefined) {
    super(CommandParameterType.Number, name, description, required);
    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  addToBuilder(builder: SlashCommandBuilder) {
    builder.addNumberOption(option => {
      option.setName(this.name);
      option.setDescription(this.description );
      option.setRequired(this.required);
      if (this.minValue) option.setMinValue(this.minValue);
      if (this.maxValue) option.setMaxValue(this.maxValue);
      return option;
    })
  }

  getOptionValue(interaction: CommandInteraction<CacheType>): any {
    return interaction.options.get(this.name)?.value as number|null;
  }
}

export class CommandBooleanParameter extends CommandParameter {
  constructor(name: string, description: string, required: boolean=false) {
    super(CommandParameterType.Boolean, name, description, required);
  }

  addToBuilder(builder: SlashCommandBuilder) {
    builder.addBooleanOption(option => {
      option.setName(this.name);
      option.setDescription(this.description );
      option.setRequired(this.required);
      return option;
    })
  }

  getOptionValue(interaction: CommandInteraction<CacheType>): any {
    return interaction.options.get(this.name)?.value as boolean|null;
  }
}

export class CommandUserParameter extends CommandParameter {
  constructor(name: string, description: string, required: boolean=false) {
    super(CommandParameterType.Boolean, name, description, required);
  }

  addToBuilder(builder: SlashCommandBuilder) {
    builder.addUserOption(option => {
      option.setName(this.name);
      option.setDescription(this.description );
      option.setRequired(this.required);
      return option;
    })
  }

  getOptionValue(interaction: CommandInteraction<CacheType>): any {
    return interaction.options.get(this.name)?.user;
  }
}

export class CommandChannelParameter extends CommandParameter {
  channelTypes: Array<ChannelType.GuildText | ChannelType.GuildVoice | ChannelType.GuildCategory | ChannelType.GuildAnnouncement | ChannelType.AnnouncementThread | ChannelType.PublicThread | ChannelType.PrivateThread | ChannelType.GuildStageVoice | ChannelType.GuildForum>|undefined;
  constructor(name: string, description: string, required: boolean=false, channelTypes=undefined) {
    super(CommandParameterType.Channel, name, description, required);
    this.channelTypes = channelTypes;
  }
  addToBuilder(builder: SlashCommandBuilder): void {
    builder.addChannelOption(option => {
      option.setName(this.name);
      option.setDescription(this.description );
      option.setRequired(this.required);
      if (this.channelTypes) option.addChannelTypes(...this.channelTypes);
      return option;
    })
  }

  getOptionValue(interaction: CommandInteraction<CacheType>): any {
    return interaction.options.get(this.name)?.channel;
  }
}

export class CommandRoleParameter extends CommandParameter {
  constructor(name: string, description: string, required: boolean=false) {
    super(CommandParameterType.Role, name, description, required);
  }

  addToBuilder(builder: SlashCommandBuilder) {
    builder.addUserOption(option => {
      option.setName(this.name);
      option.setDescription(this.description );
      option.setRequired(this.required);
      return option;
    })
  }

  getOptionValue(interaction: CommandInteraction<CacheType>): any {
    return interaction.options.get(this.name)?.role;
  }
}

export class CommandMentionableParameter extends CommandParameter {
  constructor(name: string, description: string, required: boolean=false) {
    super(CommandParameterType.Mentionable, name, description, required);
  }

  addToBuilder(builder: SlashCommandBuilder) {
    builder.addUserOption(option => {
      option.setName(this.name);
      option.setDescription(this.description );
      option.setRequired(this.required);
      return option;
    })
  }

  getOptionValue(interaction: CommandInteraction<CacheType>): any {
    let option = interaction.options.get(this.name);
    return option?.user ?? option?.role;
  }
}

export class CommandAttachmentParameter extends CommandParameter {
  constructor(name: string, description: string, required: boolean=false) {
    super(CommandParameterType.Attachment, name, description, required);
  }

  addToBuilder(builder: SlashCommandBuilder) {
    builder.addUserOption(option => {
      option.setName(this.name);
      option.setDescription(this.description );
      option.setRequired(this.required);
      return option;
    })
  }

  getOptionValue(interaction: CommandInteraction<CacheType>): any {
    return interaction.options.get(this.name)?.attachment;
  }
}

// TODO: support for command groups!

export class Command {
  name: string;
  description: string|undefined;
  params: Array<CommandParameter>;

  execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {}

  setupInteractions(manager: InteractionManager) {}

  constructor(name: string, description: string, params: Array<CommandParameter>) {
    this.name = name;
    this.description = description;
    this.params = params;
  }

  builder() {
    let builder = new SlashCommandBuilder();
    builder.setName(this.name);
    if (this.description) {
      builder.setDescription(this.description);
    }
    for (let parameter of this.params) {
      parameter.addToBuilder(builder);
    }

    return builder;
  }

  handler(client: Client, interaction: CommandInteraction) {
    let options: Map<string, any> = new Map();
    for (let option of this.params) {
      options.set(option.name, option.getOptionValue(interaction));
    }
    this.execute(client, interaction, options);
  }

  interaction(name: string) {
    return `${this.name}.${name}`;
  }
}
