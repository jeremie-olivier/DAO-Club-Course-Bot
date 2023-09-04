import { Answer, PrismaClient, Question } from "@prisma/client";
const prisma = new PrismaClient();

import { log } from "console";

export function getAnswers(questionId: number) {
  return prisma.answer.findMany({
    where: {
      questionId,
    },
    orderBy: {
      order: "asc",
    },
  });
}

export async function lessonHaveNextQuestion(
  question: Question
): Promise<boolean> {
  log(`lessonId ${question.lessonId} question order ${question.order}`);
  let lastLessonQuestion = await prisma.question.findMany({
    where: {
      lessonId: question.lessonId,
    },
    orderBy: {
      order: "desc",
    },
    take: 1,
  });

  return lastLessonQuestion[0].order == question.order ? false : true;
}
