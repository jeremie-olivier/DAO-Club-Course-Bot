import {
  Answer,
  Course,
  DiscordMsg,
  PrismaClient,
  Question,
  Role,
  Lesson,
} from "@prisma/client";

import { roles } from "./data/roles";
import discordMsg from "./data/discordMsg";

import { log } from "console";
import courses from "./data/courses";
import lessons from "./data/lessons";
import questions from "./data/questions";
import answsers from "./data/answers";

const prisma = new PrismaClient();

async function main() {
  // log(roles);
  await createRoles();

  // log(discordMsg);
  await createDiscordMsg();

  // log(courses);
  await createCourses();

  //log(lessons);
  await createLessons();

  //log(questions);
  await createQuestions();

  //log(answsers);
  await createAnswers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function createRoles() {
  for (const role of roles) {
    await prisma.role.create({
      data: role,
    });
  }

  log(`${roles.length} Roles created`);
}

async function createDiscordMsg() {
  for (const msg of discordMsg) {
    await prisma.discordMsg.create({
      data: msg,
    });
  }

  console.log(`${discordMsg.length} Discord Message created`);
}

async function createCourses() {
  for (const course of courses) {
    await prisma.course.create({
      data: course,
    });
  }

  console.log(`${courses.length} Courses created`);
}

async function createLessons() {
  for (const lesson of lessons) {
    await prisma.lesson.create({
      data: lesson,
    });
  }

  console.log(`${lessons.length} Lessons created`);
}

async function createQuestions() {
  for (const question of questions) {
    await prisma.question.create({
      data: question,
    });
  }

  console.log(`${questions.length} Questions created`);
}

async function createAnswers() {
  for (const answer of answsers) {
    await prisma.answer.create({
      data: answer,
    });
  }

  console.log(`${answsers.length} Answsers created`);
}
