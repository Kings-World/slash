import type {
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  User,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { AkairoModule } from "@kingsworld/akairo";
import type { InteractionOptions } from "./types";

export class InteractionCommand extends AkairoModule {
  constructor(id: string, readonly options: InteractionOptions = <any>{}) {
    super(id, options);
  }

  // slash command
  slash(interaction: ChatInputCommandInteraction, options: any): any {
    void [interaction, options];
  }

  // slash command autocomplete
  autocomplete(interaction: AutocompleteInteraction, focused: string): any {
    void [interaction, focused];
  }

  // message context menu
  messageContext(
    interaction: MessageContextMenuCommandInteraction,
    target: Message
  ): any {
    void [interaction, target];
  }

  // user context menu
  userContext(
    interaction: UserContextMenuCommandInteraction,
    target: User | GuildMember
  ): any {
    void [interaction, target];
  }

  // button
  button(interaction: ButtonInteraction): any {
    void [interaction];
  }

  // modal submit
  modal(interaction: ModalSubmitInteraction): any {
    void [interaction];
  }
}
