const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const modLog = require('../log');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick').setDescription('Kick a member')
    .addUserOption(o => o.setName('user').setDescription('Who to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false),
  async execute(i) {
    const member = i.options.getMember('user');
    const reason = i.options.getString('reason') ?? 'No reason provided';
    if (!member) return i.reply({ content: 'User not in this server.', ephemeral: true });
    if (!member.kickable) return i.reply({ content: "I can't kick that user.", ephemeral: true });
    if (member.roles.highest.position >= i.member.roles.highest.position && i.guild.ownerId !== i.user.id)
      return i.reply({ content: 'That user outranks you.', ephemeral: true });

    await member.kick(`${i.user.tag}: ${reason}`);
    await i.reply(`👢 Kicked **${member.user.tag}** — ${reason}`);
    modLog(i.guild, { title: 'Member Kicked', color: 0xf0b232, fields: [
      { name: 'User', value: member.user.tag, inline: true }, { name: 'Mod', value: i.user.tag, inline: true }, { name: 'Reason', value: reason }] });
  },
};
