import type {
  ApplicationCommandOptionData,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  MessageApplicationCommandData,
  UserApplicationCommandData,
} from "discord.js";
import type { AkairoModuleOptions } from "@kingsworld/akairo";

export interface SlashCommandOptions
  extends ChatInputApplicationCommandData,
    BaseOptions {
  options?: (ApplicationCommandOptionData & {
    default?: ((interaction: ChatInputCommandInteraction) => any) | any;
  })[];
}

export interface UserContextOptions
  extends UserApplicationCommandData,
    BaseOptions {}

export interface MessageContextOptions
  extends MessageApplicationCommandData,
    BaseOptions {}

interface BaseOptions {
  guildIds?: string[];
  moduleId?: string;
}

export type OptionsResolvable =
  | SlashCommandOptions
  | UserContextOptions
  | MessageContextOptions;

export interface SlashCommandChoice {
  slashCommand: SlashCommandOptions;
}

export interface ContextMenuChoice {
  contextMenu: UserContextOptions | MessageContextOptions;
}

export type CommandChoiceResolvable =
  | SlashCommandChoice
  | ContextMenuChoice
  | (SlashCommandChoice & ContextMenuChoice);

export type InteractionOptions = CommandChoiceResolvable &
  AkairoModuleOptions & {};
