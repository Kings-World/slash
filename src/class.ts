import { AkairoModule, AkairoModuleOptions } from "@kingsworld/akairo";
import type {
  ApplicationCommandOptionData,
  AutocompleteInteraction,
  Interaction as DjsInteraction,
} from "discord.js";

export interface InteractionOptions extends AkairoModuleOptions {
  name: string;
  type: "USER" | "MESSAGE" | "CHAT_INPUT" | "BUTTON";
  defaultPermission?: boolean | undefined;
  description?: string;
  options?: (ApplicationCommandOptionData & {
    default?: ((interaction: Interaction) => any) | any;
  })[];
}

export class Interaction extends AkairoModule {
  name: InteractionOptions["name"];
  type: InteractionOptions["type"];
  defaultPermission: InteractionOptions["defaultPermission"];
  description: InteractionOptions["description"];
  options: InteractionOptions["options"];

  constructor(id: string, options: InteractionOptions) {
    super(id, options);
    this.name = options.name;
    this.type = options.type;
    this.defaultPermission = options.defaultPermission;
    this.description = options.description;
    this.options = options.options;
  }

  exec(interaction: DjsInteraction, options: any = {}): any {
    void [interaction, options]
    return Promise.resolve()
  }

  autocomplete(interaction: AutocompleteInteraction, options: any = {}): any {
    void [interaction, options]
    return Promise.resolve()
  }
}
