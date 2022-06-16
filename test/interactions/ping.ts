import { Interaction } from "../../src";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";

export default class Ping extends Interaction {
  constructor() {
    super("ping", {
      name: "ping",
      type: "CHAT_INPUT",
      description: "send a simple ping pong msg",
      options: [
        {
          name: "user",
          type: "STRING",
          description: "who to ping pong with",
          autocomplete: true,
          required: true,
        },
        {
          name: "channel",
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
          description: "which channel to ping pong",
          required: true,
        },
      ],
    });
  }

  override exec(interaction: CommandInteraction, { user, channel }: any) {
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
