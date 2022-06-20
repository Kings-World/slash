import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord-api-types/v10";
import type {
  User,
  UserContextMenuCommandInteraction,
  ChatInputCommandInteraction,
} from "discord.js";
import { InteractionCommand } from "../../src";

export default class Avatar extends InteractionCommand {
  constructor() {
    super("avatar", {
      slashCommand: {
        name: "avatar",
        description: "view a users avatar",
        options: [
          {
            name: "user",
            description: "the user",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
        ],
      },
      contextMenu: {
        name: "View Avatar",
        type: ApplicationCommandType.User,
      },
    });
  }

  override slash(
    interaction: ChatInputCommandInteraction,
    { user }: { user: User }
  ) {
    return interaction.reply(user.displayAvatarURL());
  }

  override userContext(
    interaction: UserContextMenuCommandInteraction,
    target: User
  ) {
    return interaction.reply(target.displayAvatarURL());
  }
}
