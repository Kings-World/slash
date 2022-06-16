import {
  AkairoClient,
  AkairoHandler,
  AkairoHandlerOptions,
} from "@kingsworld/akairo";
import { Interaction as Base, InteractionOptions } from "./class";
import type {
  AutocompleteInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  Interaction,
} from "discord.js";

export class InteractionHandler extends AkairoHandler {
  constructor(client: AkairoClient, options: AkairoHandlerOptions) {
    super(client, { classToHandle: Base, ...options });

    this.client.once("ready", () => {
      this.loadAll();

      this.client.on("interactionCreate", (interaction: Interaction) => {
        const handle = this.parseFunc(interaction);

        if (interaction.isCommand()) {
          return handle(this.modules.get(interaction.commandName), true);
        }

        if (interaction.isButton()) {
          return handle(this.modules.get(interaction.customId));
        }

        if (interaction.isAutocomplete()) {
          return handle(
            this.modules.get(interaction.commandName),
            interaction.options.getFocused(),
            true
          );
        }

        if (interaction.isContextMenu()) {
          const options = interaction.isUserContextMenu()
            ? interaction.targetMember ?? interaction.targetUser
            : interaction.isMessageContextMenu()
            ? interaction.targetMessage
            : {};

          return handle(this.modules.get(interaction.commandName), options);
        }
      });
    });
  }

  parseFunc(interaction: Interaction) {
    return async (module: any, options?: boolean | any, ac?: boolean) => {
      if (!module) return;
      options =
        options === true ? this.transform(<any>interaction) : options ?? {};

      try {
        this.emit("started", interaction, module, options);
        return await module?.[ac ? "autocomplete" : "exec"](
          interaction,
          options
        );
      } catch (e) {
        this.emit("error", e, interaction, module, options);
      }
    };
  }

  transform(
    interaction:
      | CommandInteraction
      | ContextMenuInteraction
      | AutocompleteInteraction,
    options?: InteractionOptions["options"]
  ) {
    // majority of this function was originally created my melike2d, i just added the default value method
    // https://github.com/lavaclient/djs-v13-example/blob/main/src/index.ts#L42-L45
    const mappedOptions = interaction.options.data.map((i) => {
      const value =
        i.role ?? i.channel ?? i.user ?? i.member ?? i.message ?? i.value;
      return { [i.name]: value };
    });

    const toDefault = (val: any) =>
      typeof val === "function" ? val(interaction) : val;

    return Object.assign(
      (options ?? []).reduce(
        (o, i) => ({ ...o, [i.name]: toDefault(i.default) }),
        {}
      ),
      ...mappedOptions
    );
  }

  override register(interaction: Base, filepath?: string) {
    super.register(interaction, filepath);
  }
}
