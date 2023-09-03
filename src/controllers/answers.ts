import { Answer, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { log } from "console";

export function getAnswers(lessonId: number, questionId: number) {
  return prisma.answer.findMany({
    where: {
      lessonId,
      questionId,
    },
    orderBy: {
      order: "asc",
    },
  });
}

export async function lessonHaveNextQuestion(
  lessonId: number,
  questionId: number
): Promise<boolean> {
  log(`lessonId ${lessonId} questionId ${lessonId}`);
  let lastLessonQuestion = await prisma.question.findMany({
    where: {
      lessonId,
    },
    orderBy: {
      order: "desc",
    },
    take: 1,
  });

  return lastLessonQuestion[0].id == questionId ? false : true;
}
