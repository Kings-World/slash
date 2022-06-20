import "dotenv/config";
import { AkairoClient } from "@kingsworld/akairo";
import { InteractionHandler } from "../src";
import { join } from "path";
import { IntentsBitField } from "discord.js";

const { Guilds, GuildMembers } = IntentsBitField.Flags;

class Client extends AkairoClient {
  interactions = new InteractionHandler(this, {
    directory: join(__dirname, "interactions"),
  });
}

const client = new Client({
  ownerID: process.env.OWNERS!.split(/,\s?/),
  intents: [Guilds, GuildMembers],
});

client.once("ready", async () => {
  console.log(
    `started ${client.user!.tag} with ${
      client.interactions.modules.size
    } interaction(s) cached`
  );

  await client.interactions.setup();
});

// @ts-ignore
client.interactions.on("started", (i, m, o) => {
  console.log(`${o.name} started by ${i.user.tag}`);
});

// @ts-ignore
client.interactions.on("error", (e, i, m, o) => {
  console.log(`${o.name} ${i.user.tag} got an error :: ${e.message}`);
});

void client.login(process.env.TOKEN);
