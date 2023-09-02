import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import { PrismaClient } from "@prisma/client";
import { log } from "console";
const prisma = new PrismaClient();

export const data = new SlashCommandBuilder()
  .setName("onboarding")
  .setDescription("Reply with onboarding message under!");

async function getOnboardingMessage() {
  const onboardingMsg = await prisma.discordMsg.findUnique({
    where: {
      slug: "onboarding",
    },
  });
  return onboardingMsg;
}

export async function execute(interaction: CommandInteraction) {
  let discordMsg = await getOnboardingMessage();
  log(discordMsg);
  let rep = {
    content: discordMsg?.content,
    tts: false,
    components: [
      {
        type: 1,
        components: [
          {
            style: 3,
            label: `Click here to get started`,
            custom_id: `get-lesson-1-role`,
            disabled: false,
            type: 2,
          },
        ],
      },
    ],
  };
  interaction.reply({ ephemeral: true, content: "success" });
  return interaction.channel?.send(rep);
}
