import {
  CommandInteraction,
  GuildMember,
  MessageReaction,
  Snowflake,
  User,
} from "discord.js";

export async function addRoleToMember(
  member: GuildMember,
  roleId: string
): Promise<void> {
  member.roles.add(roleId);
}

//   export async function removeRolesFromMember(): Promise<void> {
//     (this.member as GuildMember).roles.remove(this.roleIds as Snowflake[]);
//   }

async function getMember(
  interaction: CommandInteraction,
  user: User
): Promise<any> {
  return interaction.guild?.members.fetch(user);
}
