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
  interaction.reply({ ephemeral: false, content: discordMsg?.content });

  log(discordMsg);
  let rep = {
    content: "** **\nFinished watching this video?\n** ** ",
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
  return interaction.channel?.send(rep);
}
