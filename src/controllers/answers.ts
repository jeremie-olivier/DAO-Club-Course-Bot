import { Answer, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { log } from "console";

export function getAnswers(courseId: number, questionId: number) {
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

export async function lessonHaveNextQuestion(
  courseId: number,
  questionId: number
): Promise<boolean> {
  log(`courseId ${courseId} questionId ${questionId}`);
  let lastLessonQuestion = await prisma.question.findMany({
    where: {
      courseId: courseId,
    },
    orderBy: {
      order: "desc",
    },
    take: 1,
  });

  return lastLessonQuestion[0].id == questionId ? false : true;
}
