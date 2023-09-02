import {
  Answer,
  Course,
  DiscordMsg,
  PrismaClient,
  Question,
  Role,
  Season,
} from "@prisma/client";

import { roles } from "./data/roles";
import discordMsg from "./data/discordMsg";

import { log } from "console";
import seasons from "./data/season";
import courses from "./data/course";
import questions from "./data/questions";
import answsers from "./data/answers";

const prisma = new PrismaClient();

async function main() {
  log(roles);
  await createRoles();

  log(discordMsg);
  await createDiscordMsg();

  log(seasons);
  await createSeasons();

  log(courses);
  await createCourse();

  log(questions);
  await createQuestions();

  log(answsers);
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
  await Promise.all(
    roles.map((c: Role) =>
      prisma.role.create({
        data: c,
      })
    )
  );
}

async function createDiscordMsg() {
  await Promise.all(
    discordMsg.map((c: DiscordMsg) =>
      prisma.discordMsg.create({
        data: c,
      })
    )
  );

  console.log(`${roles.length} Discord Message created`);
}

async function createSeasons() {
  await Promise.all(
    seasons.map((c: Season) =>
      prisma.season.create({
        data: c,
      })
    )
  );

  console.log(`${roles.length} Discord Message created`);
}

async function createCourse() {
  await Promise.all(
    courses.map((c: Course) =>
      prisma.course.create({
        data: c,
      })
    )
  );

  console.log(`${roles.length} Discord Message created`);
}

async function createQuestions() {
  await Promise.all(
    questions.map((c: Question) =>
      prisma.question.create({
        data: c,
      })
    )
  );

  console.log(`${roles.length} Discord Message created`);
}

async function createAnswers() {
  await Promise.all(
    answsers.map((c: Answer) =>
      prisma.answer.create({
        data: c,
      })
    )
  );

  console.log(`${roles.length} Answsers created`);
}
