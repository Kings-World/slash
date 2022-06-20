import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  ChannelType,
  CommandInteraction,
} from "discord.js";
import { InteractionCommand } from "../../src";

export default class Ping extends InteractionCommand {
  constructor() {
    super("ping", {
      slashCommand: {
        name: "ping",
        description: "send a simple ping pong msg",
        options: [
          {
            name: "user",
            type: ApplicationCommandOptionType.String,
            description: "who to ping pong with",
            autocomplete: true,
            required: true,
          },
          {
            name: "channel",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            description: "which channel to ping pong",
            required: true,
          },
        ],
      },
    });
  }

  override slash(interaction: CommandInteraction, { user, channel }: any) {
    return interaction.reply({
      content: `time for ping pong with <@${user}> in ${channel} 🏓`,
      ephemeral: true,
    });
  }

  override async autocomplete(
    interaction: AutocompleteInteraction,
    focused: string
  ) {
    const arr = this.client.users.cache
      .filter((u) => u.tag.toLowerCase().includes(focused))
      .map((u) => ({ name: u.tag, value: u.id }));
    return interaction.respond(arr.slice(0, 25));
  }
}
