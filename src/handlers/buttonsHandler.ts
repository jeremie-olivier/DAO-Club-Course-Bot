import { ButtonInteraction, GuildMember, User } from "discord.js";
import { addRoleToMember } from "./roleManager";
import { log } from "console";

import { Answer, PrismaClient } from "@prisma/client";
import createAnswers from "../controllers/userAnswers";
const prisma = new PrismaClient();

export async function buttonsHandler(interaction: ButtonInteraction) {
  log(interaction.customId);

  if (interaction.customId.includes("answer-id")) {
    handleAnswer(interaction);
  }

  switch (interaction.customId) {
    case "get-lesson-1-role":
      let roleId = await getRoleId("lesson-1");

      if (!roleId) break;
      addRoleToMember(interaction.member as GuildMember, roleId);
      let lessons1Channnel = "1146931985000968233";
      interaction.reply({
        ephemeral: true,
        content: `You know have access to  <#${lessons1Channnel}>`,
      });

      break;

    case "start-quizz-lesson-1":
      let reply = await generateQuestion(interaction, 1, 1);
      interaction.reply(reply);
      break;

    default:
      break;
  }
}

async function getRoleId(name: string) {
  const role = await prisma.role.findUnique({
    where: {
      name: name,
    },
  });
  return role?.discordId;
}

async function getQuestion(courseId: number, order: number) {
  log(`requesting question ${order} from course ${courseId}`);
  const question = await prisma.question.findFirstOrThrow({
    where: {
      courseId: courseId,
      order: order,
    },
  });
  return question;
}

async function generateQuestion(
  interaction: ButtonInteraction,
  courseId: number,
  order: number
) {
  let questionObj = await getQuestion(courseId, order);
  let questionText = questionObj.text;
  let question = `Question ${questionObj.order} - ${questionText} \n\n`;

  let answers = await getAnswers(courseId, questionObj.id);
  let answersText = await generateAnswersText(answers);
  question += answersText.join("\n");

  let answsersComponents = await generateAnswersComponents(answers);

  return {
    ephemeral: true,
    content: question,
    components: [
      {
        type: 1,
        components: answsersComponents,
      },
    ],
  };
}

async function generateAnswersText(answsers: Answer[]) {
  let answersText = answsers.map(
    (answer) =>
      `:regional_indicator_${answer.order.toLocaleLowerCase()}: - ${
        answer.text
      }`
  );
  return answersText;
}

function getAnswers(courseId: number, questionId: number) {
  return prisma.answer.findMany({
    where: {
      courseId: courseId,
      questionId: questionId,
    },
    orderBy: {
      order: "asc",
    },
  });
}

function generateAnswersComponents(answers: Answer[]) {
  return answers.map((answer) => {
    return {
      style: 1,
      label: `${answer.order}`,
      custom_id: `answer-id-${answer.id}`,
      disabled: false,
      type: 2,
    };
  });
}
async function handleAnswer(
  interaction: ButtonInteraction<import("discord.js").CacheType>
) {
  let params = interaction.customId.split("-");
  let anwserId = parseInt(params[2]);

  let answer = await prisma.answer.findFirst({
    where: {
      id: anwserId,
    },
  });

  if (!answer) return "";

  log(interaction.member);

  createAnswers(interaction.member?.user as User, answer);

  if (answer?.isTheCorrectAnswer) {
    await interaction.update({
      content: `Correct! Well done! 🎉 `,
      components: [],
    });

    let reply = await generateQuestion(
      interaction,
      answer.courseId,
      answer.questionId + 1
    );
    interaction.followUp(reply);
  } else {
    interaction.reply({
      ephemeral: true,
      content: `Oops, nope that's not the correct answer. 😬

Try again... !`,
    });
  }
}
