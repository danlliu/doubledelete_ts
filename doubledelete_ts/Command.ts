import { CacheType, ChannelType, Client, CommandInteraction, CommandInteractionOptionResolver, Message, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandUserOption } from "discord.js"
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

  addToBuilder(builder: any) {
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

  addToBuilder(builder: any) {
    builder.addStringOption((option: SlashCommandStringOption) => {
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

  addToBuilder(builder: any) {
    builder.addIntegerOption((option: SlashCommandIntegerOption) => {
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

  addToBuilder(builder: any) {
    builder.addNumberOption((option: SlashCommandNumberOption) => {
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

  addToBuilder(builder: any) {
    builder.addBooleanOption((option: SlashCommandBooleanOption) => {
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

  addToBuilder(builder: any) {
    builder.addUserOption((option: SlashCommandUserOption) => {
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
  addToBuilder(builder: any): void {
    builder.addChannelOption((option: SlashCommandChannelOption) => {
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

  addToBuilder(builder: any) {
    builder.addUserOption((option: SlashCommandRoleOption) => {
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

  addToBuilder(builder: any) {
    builder.addUserOption((option: SlashCommandMentionableOption) => {
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

  addToBuilder(builder: any) {
    builder.addUserOption((option: SlashCommandAttachmentOption) => {
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

export class Subcommand {
  name: string;
  description: string;
  params: Array<CommandParameter>;

  execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {}

  constructor(name: string, description: string, params: Array<CommandParameter>) {
    this.name = name;
    this.description = description;
    this.params = params;
  }
  
  addToBuilder(builder: any) {
    builder.addSubcommand((subcommand: SlashCommandSubcommandBuilder) => {
      subcommand.setName(this.name).setDescription(this.description);
      for (let parameter of this.params) {
        parameter.addToBuilder(subcommand);
      }
      return subcommand;
    });
  }
}

export class SubcommandGroup {
  name: string;
  description: string;
  subcommands: Array<Subcommand>;

  constructor(name: string, description: string, subcommands: Array<Subcommand>) {
    this.name = name;
    this.description = description;
    this.subcommands = subcommands;
  }
  
  addToBuilder(builder: any) {
    builder.addSubcommandGroup((group: SlashCommandSubcommandGroupBuilder) => {
      group.setName(this.name).setDescription(this.description);
      for (let subcommand of this.subcommands) {
        subcommand.addToBuilder(group);
      }
      return group;
    });
  }
}

export class Command {
  name: string;
  description: string|undefined;
  children: Array<CommandParameter> | Array<Subcommand> | Array<SubcommandGroup>;

  execute(client: Client, interaction: CommandInteraction, parameters: Map<string, any>) {}

  setupInteractions(manager: InteractionManager) {}

  constructor(name: string, description: string, children: Array<CommandParameter> | Array<Subcommand> | Array<SubcommandGroup>) {
    this.name = name;
    this.description = description;
    this.children = children;
  }

  builder() {
    let builder = new SlashCommandBuilder();
    builder.setName(this.name);
    if (this.description) {
      builder.setDescription(this.description);
    }
    for (let parameter of this.children) {
      parameter.addToBuilder(builder);
    }

    return builder;
  }

  handler(client: Client, interaction: CommandInteraction) {
    let options: Map<string, any> = new Map();

    if (this.children.length === 0 || this.children.at(0)! instanceof CommandParameter) {
      for (let child of this.children) {
        options.set(child.name, (child as CommandParameter)!.getOptionValue(interaction));
      }
      this.execute(client, interaction, options);
    } else if (this.children.at(0)! instanceof Subcommand) {
      for (let subcommand of this.children as Array<Subcommand>) {
        if (subcommand.name === (interaction.options as CommandInteractionOptionResolver).getSubcommand(true)) {
          for (let child of subcommand.params) {
            options.set(child.name, (child as CommandParameter)!.getOptionValue(interaction));
          }
          subcommand.execute(client, interaction, options);
          return;
        }
      }
    } else if (this.children.at(0)! instanceof SubcommandGroup) {
      for (let subcommandGroup of this.children as Array<SubcommandGroup>) {
        if (subcommandGroup.name === (interaction.options as CommandInteractionOptionResolver).getSubcommandGroup(true)) {
          for (let subcommand of subcommandGroup.subcommands as Array<Subcommand>) {
            if (subcommand.name === (interaction.options as CommandInteractionOptionResolver).getSubcommand(true)) {
              for (let child of subcommand.params) {
                options.set(child.name, (child as CommandParameter)!.getOptionValue(interaction));
              }
              subcommand.execute(client, interaction, options);
              return;
            }
          }
        }
      }
    }
  }

  interaction(name: string) {
    return `${this.name}.${name}`;
  }

  isSubcommand(interaction: CommandInteraction, subcommand: string) {
    return (interaction.options as CommandInteractionOptionResolver).getSubcommand() === subcommand;
  }

  isSubcommandGroup(interaction: CommandInteraction, subcommandGroup: string) {
    return (interaction.options as CommandInteractionOptionResolver).getSubcommandGroup() === subcommandGroup;
  }
}
