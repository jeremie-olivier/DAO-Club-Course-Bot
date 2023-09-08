import { User } from "discord.js";

import { Answer, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { log } from "console";

async function saveUserAnswers(user: User, anwser: Answer) {
  log(`user id  is ${user.id} `);
  log(`user username  is ${user.username} `);
  log(`user globalname  is ${user.globalName} `);
  log(`user avatar  is ${user.avatarURL()} `);

  let userDb = await prisma.user.upsert({
    where: {
      discordId: user.id,
    },
    update: {
      discordUsername: user.displayName,
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
}

export default saveUserAnswers;
