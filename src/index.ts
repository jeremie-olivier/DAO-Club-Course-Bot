import { Client, GuildMember } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { log } from "console";
import { addRoleToMember } from "./handlers/roleManager";
import { buttonsHandler } from "./handlers/buttonsHandler";

export const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {
  console.log("Discord bot is ready! 🤖");

  // commands.ping.execute()
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.applicationId != config.DISCORD_CLIENT_ID) return;

  if (interaction.isButton()) {
    buttonsHandler(interaction);
  }

  if (interaction.isCommand()) {
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
      commands[commandName as keyof typeof commands].execute(interaction);
    }
  }
});

client.login(config.DISCORD_TOKEN);
