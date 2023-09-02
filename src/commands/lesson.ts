import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { log } from "console";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const data = new SlashCommandBuilder()
  .setName("lesson")
  .setDescription("Reply with lesson message under!");

async function getLessonMessage(lessonId: number, partId: number) {
  const lessongMsg = await prisma.discordMsg.findUnique({
    where: {
      slug: `lesson-${lessonId}-part-${partId}`,
    },
  });
  return lessongMsg;
}

export async function execute(interaction: CommandInteraction) {
  let lessongMsg1 = await getLessonMessage(1, 1);
  let rep1 = {
    content: lessongMsg1?.content,
    tts: false,
  };
  await interaction.channel?.send(rep1);

  let lessongMsg2 = await getLessonMessage(1, 2);
  let rep2 = {
    content: lessongMsg2?.content,
    tts: false,
    components: [
      {
        type: 1,
        components: [
          {
            style: 3,
            label: `Start the quizz`,
            custom_id: `start-quizz-lesson-1`,
            disabled: false,
            type: 2,
          },
        ],
      },
    ],
  };

  interaction.reply({ ephemeral: true, content: "success" });
  return interaction.channel?.send(rep2);
}
