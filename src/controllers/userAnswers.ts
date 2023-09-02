import { User } from "discord.js";

import { Answer, PrismaClient } from "@prisma/client";
import { log } from "console";
const prisma = new PrismaClient();

async function createAnswers(user: User, anwser: Answer) {
  log(`user id  is ${user.id} `);
  log(`user username  is ${user.username} `);
  log(`user globalname  is ${user.globalName} `);
  log(`user avatar  is ${user.avatarURL()} `);

  let userDb = await prisma.user.upsert({
    where: {
      discordId: user.id,
    },
    update: {
      discordUsername: user.username,
      discordAvatarUrl: user.avatarURL(),
      answsers: {
        connect: anwser,
      },
    },
    create: {
      discordUsername: user.username,
      discordId: user.id,
      discordAvatarUrl: user.avatarURL(),
      answsers: {
        connect: anwser,
      },
    },
  });

  // await prisma.answer.create({ data: c })
}

export default createAnswers;
