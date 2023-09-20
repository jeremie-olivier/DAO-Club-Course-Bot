import { CommandInteraction, GuildMember, Snowflake, User } from "discord.js";

import { Role, PrismaClient } from "@prisma/client";
import { log } from "console";
const prisma = new PrismaClient();

export async function addRoleToMember(
  member: GuildMember,
  roleName: string
): Promise<void> {
  log(`adding role ${roleName} to member ${member.user.username}`);
  let roleId = await getRoleId(roleName);
  log(roleId);

  if (!roleId) log(`role ${roleName} not found`);
  else await member.roles.add(roleId);
}

async function getRoleId(name: string) {
  const role = await prisma.role.findUnique({
    where: {
      name: name,
    },
  });
  return role?.discordId;
}

export async function removeRolesFromMember(
  member: GuildMember
): Promise<void> {
  const roles = await prisma.role.findMany({
    where: {
      fullAccessToCourse: false,
    },
  });

  let roleIds = roles.map((r) => r.discordId);
  await member.roles.remove(roleIds as Snowflake[]);
}

async function getMember(
  interaction: CommandInteraction,
  user: User
): Promise<any> {
  return interaction.guild?.members.fetch(user);
}
