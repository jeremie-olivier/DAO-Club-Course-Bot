import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import { PrismaClient } from "@prisma/client";
import { log } from "console";
const prisma = new PrismaClient();

export const data = new SlashCommandBuilder()
  .setName("complete")
  .setDescription("Reply with the course completion message under!");

async function getMessage() {
  const msg = await prisma.discordMsg.findUnique({
    where: {
      slug: "course-complete",
    },
  });

  log(msg);
  return msg;
}

export async function execute(interaction: CommandInteraction) {
  log("in this ");
  let discordMsg = await getMessage();

  interaction.reply({ ephemeral: false, content: discordMsg?.content });

  log(discordMsg);
  let rep = {
    content: `ok`,
    tts: false,
  };
  return interaction.channel?.send(rep);
}
