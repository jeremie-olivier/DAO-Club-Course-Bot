import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { log } from "console";

import lessons from "../../prisma/seed/data/lessons";

import { Lesson, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { render } from "template-file";

let lessonsChoices = lessons.map((lesson: Lesson) => {
  return {
    name: `Lesson ${lesson.order} - ${lesson.name}`,
    value: lesson.name,
  };
});

export const data = new SlashCommandBuilder()
  .setName("lesson")
  .setDescription("Reply with lesson message under!")
  .addStringOption((option) =>
    option
      .setName("lesson")
      .setDescription("The lesson you want to see")
      .setRequired(true)
      .addChoices(...lessonsChoices)
  );

async function getLessonMessage(partId: number) {
  const lessongMsg = await prisma.discordMsg.findUnique({
    where: {
      slug: `lesson-part-${partId}`,
    },
  });
  return lessongMsg;
}

export async function execute(interaction: CommandInteraction) {
  // @ts-ignore
  let choosedLesson = interaction.options.getString("lesson");

  log(choosedLesson);

  let lesson = await prisma.lesson.findFirst({
    where: {
      name: choosedLesson,
    },
  });

  log(lesson);

  if (!lesson) {
    return interaction.reply({ content: "Lesson not found", ephemeral: true });
  }

  const data = {
    lessonOrder: lesson?.order,
    lessonName: lesson?.name,
    lessonVideoUrl: lesson?.videoUrl,
  };

  let lessongMsg1 = await getLessonMessage(1);
  if (!lessongMsg1) {
    return interaction.reply({
      content: "Lesson message not found",
      ephemeral: true,
    });
  }

  let lessongMsg1WithData = render(lessongMsg1?.content, data);

  let rep1 = {
    content: lessongMsg1WithData,
    tts: false,
  };
  await interaction.channel?.send(rep1);

  let lessongMsg2 = await getLessonMessage(2);
  if (!lessongMsg2) {
    return interaction.reply({
      content: "Lesson message not found",
      ephemeral: true,
    });
  }
  let lessongMsg2WithData = render(lessongMsg2?.content, data);

  let rep2 = {
    content: lessongMsg2WithData,
    tts: false,
    components: [
      {
        type: 1,
        components: [
          {
            style: 3,
            label: `Start the quiz`,
            custom_id: `start-quiz-course-${lesson.courseId}-lesson-${lesson.order}`,
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
