import "dotenv/config";
import { AkairoClient } from "@kingsworld/akairo";
import { InteractionHandler } from "../src";
import { join } from "path";

class Client extends AkairoClient {
  interactions = new InteractionHandler(this, {
    directory: join(__dirname, "interactions"),
  });
}

const client = new Client({
  ownerID: process.env.OWNERS!.split(/,\s?/),
  intents: ["GUILDS", "GUILD_MEMBERS"],
});

client.once("ready", async () => {
  console.log(
    `started ${client.user!.tag} with ${
      client.interactions.modules.size
    } interaction(s) cached`
  );

  const cmds = client.interactions.modules
    .filter((m: any) => m.type !== "BUTTON")
    .map((m: any) => ({
      name: m.name,
      type: m.type,
      description: m.description,
      options: m.options,
      defaultPermission: m.defaultPermission,
    }));

  await client.guilds.cache.get(process.env.GUILD_ID!)?.commands.set(cmds);
});

// @ts-ignore
client.interactions.on("started", (i, m, o) => {
  console.log(`${m.name} (${m.type}) started by ${i.user.tag}`);
});

// @ts-ignore
client.interactions.on("error", (e, i, m) => {
  console.log(
    `${m.name} (${m.type}) ${i.user.tag} got an error :: ${e.message}`
  );
});

client.login(process.env.TOKEN);
