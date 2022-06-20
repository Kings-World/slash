import {
  AkairoClient,
  AkairoHandler,
  AkairoHandlerOptions,
  LoadPredicate,
} from "@kingsworld/akairo";
import {
  AnyInteraction,
  AutocompleteInteraction,
  Collection,
  CommandInteraction,
  ContextMenuCommandInteraction,
} from "discord.js";
import type { SlashCommandOptions, OptionsResolvable } from "./types";
import { InteractionCommand } from "./class";
import { InteractionType } from "discord-api-types/v10";
import { isPromise } from "util/types";

export class InteractionHandler extends AkairoHandler {
  override modules!: Collection<string, InteractionCommand>;
  commands: Collection<string, OptionsResolvable> = this.commandOptions();

  constructor(client: AkairoClient, options: AkairoHandlerOptions) {
    super(client, { classToHandle: InteractionCommand, ...options });

    this.client.once("ready", () => {
      this.loadAll();

      this.client.on("interactionCreate", (interaction: AnyInteraction) => {
        const { type } = interaction;
        const handle = this.createHandler(interaction);

        if (interaction.isChatInputCommand()) {
          return handle(interaction.commandName, (module) =>
            module.slash(interaction, this.transform(interaction))
          );
        }

        if (interaction.isButton()) {
          return handle(interaction.customId, (module) =>
            module.button(interaction)
          );
        }

        if (type === InteractionType.ApplicationCommandAutocomplete) {
          return handle(interaction.commandName, (module) =>
            module.autocomplete(interaction, interaction.options.getFocused())
          );
        }

        if (interaction.isUserContextMenuCommand()) {
          return handle(interaction.commandName, (module) =>
            module.userContext(
              interaction,
              <any>interaction.targetMember ?? interaction.targetUser
            )
          );
        }

        if (interaction.isMessageContextMenuCommand()) {
          return handle(interaction.commandName, (module) =>
            module.messageContext(interaction, interaction.targetMessage)
          );
        }

        if (type === InteractionType.ModalSubmit) {
          return handle(interaction.customId, (module) =>
            module.modal(interaction)
          );
        }
      });
    });
  }

  private createHandler(interaction: AnyInteraction) {
    return async (str: string, fn: (module: InteractionCommand) => any) => {
      const option = this.commands.get(str);
      const module = this.modules.get(option?.moduleId ?? "");
      const eventData = [interaction, module, option];
      if (!module) return;

      try {
        this.emit("started", ...eventData);
        const func = fn(module);
        return isPromise(func) ? await func : func;
      } catch (e) {
        this.emit("error", e, ...eventData);
      }

      return module ? fn(module) : null;
    };
  }

  transform(
    interaction:
      | CommandInteraction
      | ContextMenuCommandInteraction
      | AutocompleteInteraction,
    options?: SlashCommandOptions["options"]
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

  async setup() {
    const global = this.filterModules("global");
    const guild = this.filterModules("guild");

    if (global.length) {
      console.log(`setting ${global.length} global commands`);
      await this.client.application?.commands.set(global);
    }

    if (guild.length) {
      console.log(`setting ${guild.length} guild commands`);
      const guildIds = guild.reduce(
        (acc, { guildIds }) => [...acc, ...(guildIds ?? [])],
        new Array<string>()
      );

      for (const guildId of guildIds) {
        const guildCmds = guild.filter((m) => !!m.guildIds?.includes(guildId));
        await this.client.application?.commands.set(guildCmds, guildId);
      }
    }
  }

  override loadAll(directory?: string, filter?: LoadPredicate): this {
    const loaded = super.loadAll(directory, filter);
    this.commands = this.commandOptions();
    return loaded;
  }

  private filterModules(type: "global" | "guild") {
    return [...this.commands.values()].filter((m) => {
      const isLength = !!m.guildIds?.length;
      return (type === "global" && !isLength) || (type === "guild" && isLength);
    });
  }

  private commandOptions() {
    return this.modules.reduce((acc, { options, id }) => {
      if ("slashCommand" in options) {
        const slash = options.slashCommand;
        slash.moduleId = id;
        acc.set(slash.name, slash);
      }

      if ("contextMenu" in options) {
        const context = options.contextMenu;
        context.moduleId = id;
        acc.set(context.name, context);
      }

      return acc;
    }, new Collection<string, OptionsResolvable>());
  }
}
