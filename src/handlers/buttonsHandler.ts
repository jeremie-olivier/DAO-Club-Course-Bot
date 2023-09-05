import { ButtonInteraction, GuildMember, User } from "discord.js";
import { addRoleToMember } from "./roleManager";
import { log } from "console";

import { Answer, PrismaClient } from "@prisma/client";

import saveUserAnswer from "../controllers/userAnswers";
import { lessonHaveNextQuestion, getAnswers } from "../controllers/answers";
import channels from "../config/channels";
import { getChannelId } from "../utils";

const prisma = new PrismaClient();

export async function buttonsHandler(interaction: ButtonInteraction) {
  log(interaction.customId);

  if (interaction.customId.includes("answer-id")) {
    handleAnswer(interaction);
  }
  if (interaction.customId.includes("start-quizz")) {
    let courseId = parseInt(interaction.customId.split("-")[3]);
    let lessonId = parseInt(interaction.customId.split("-")[5]);
    log(lessonId);

    let reply = await generateQuestion(interaction, lessonId, 1);
    interaction.reply(reply);
  }

  switch (interaction.customId) {
    case "get-lesson-1-role":
      addRoleToMember(interaction.member as GuildMember, "lesson-1");

      let lessons1Channnel = "1146931985000968233";
      interaction.reply({
        ephemeral: true,
        content: `You know have access to  <#${lessons1Channnel}>`,
      });

      break;

    default:
      break;
  }
}

async function getQuestion(lessonId: number, order: number) {
  log(`requesting question ${order} from lesson ${lessonId}`);
  const question = await prisma.question.findFirstOrThrow({
    where: {
      lessonId,
      order: order,
    },
  });
  return question;
}

async function generateQuestion(
  interaction: ButtonInteraction,
  lessonId: number,
  order: number
) {
  let questionObj = await getQuestion(lessonId, order);
  log(questionObj);

  let question = `Question ${questionObj.order} - ${questionObj.text} \n\n`;

  let answers = await getAnswers(questionObj.id);
  let answersText = await generateAnswersText(answers);
  question += answersText.join("\n");

  log(question);

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
    include: {
      question: {
        include: {
          lesson: true,
        },
      },
    },
  });

  if (!answer) return "";

  log(interaction.member);

  await saveUserAnswer(interaction.member?.user as User, answer);

  if (answer?.isTheCorrectAnswer) {
    await interaction.update({
      content: `Correct! Well done! 🎉 `,
      components: [],
    });

    let shouldGoToNextQuestion = await lessonHaveNextQuestion(answer.question);
    log(shouldGoToNextQuestion);
    if (shouldGoToNextQuestion) {
      let reply = await generateQuestion(
        interaction,
        answer.lessonId,
        answer.question.order + 1
      );
      interaction.followUp(reply);
    } else {
      let currentLessonQuestionChannelId = getChannelId(
        `lesson-${answer.lessonId}-questions`
      );
      let nextLessonChannelId = getChannelId(`lesson-${answer.lessonId + 1}`);
      addRoleToMember(
        interaction.member as GuildMember,
        `lesson-${answer.lessonId + 1}`
      );

      interaction.followUp({
        ephemeral: true,
        content: `Congratulations, you've now answered all the questions correctly. 🙌 

Jump into the <#${currentLessonQuestionChannelId}> channel and ask the community any further questions you may have on Lesson ${answer.lessonId}. 💬 
        
If you don't have any further questions, then move onto <#${nextLessonChannelId}> to start watching your next video. 📹 
        `,
      });
    }
  } else {
    interaction.reply({
      ephemeral: true,
      content: `Oops, nope that's not the correct answer. 😬

Try again... !`,
    });
  }
}
