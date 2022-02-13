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
          name: "test",
          type: "STRING",
          description: "testing autocomplete",
          autocomplete: true,
          required: true,
        },
      ],
    });
  }

  override exec(interaction: CommandInteraction, { test }: { test: string }) {
    return interaction.reply(`🏓 playing ping pong with **${test}**`);
  }

  override async autocomplete(
    interaction: AutocompleteInteraction,
    focused: string
  ) {
    const arr = this.client.users.cache
      .filter((u) => u.tag.includes(focused))
      .map((u) => ({ name: u.tag, value: u.tag }));
    return interaction.respond(arr.slice(0, 25));
  }
}
