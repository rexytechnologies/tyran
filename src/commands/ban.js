const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const modLog = require('../log');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban').setDescription('Ban a member')
    .addUserOption(o => o.setName('user').setDescription('Who to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .addIntegerOption(o => o.setName('delete_days').setDescription('Days of messages to delete (0-7)').setMinValue(0).setMaxValue(7))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),
  async execute(i) {
    const user = i.options.getUser('user');
    const reason = i.options.getString('reason') ?? 'No reason provided';
    const member = await i.guild.members.fetch(user.id).catch(() => null);
    if (member && !member.bannable) return i.reply({ content: "I can't ban that user.", ephemeral: true });
    if (member && member.roles.highest.position >= i.member.roles.highest.position && i.guild.ownerId !== i.user.id)
      return i.reply({ content: 'That user outranks you.', ephemeral: true });

    await i.guild.members.ban(user, { reason: `${i.user.tag}: ${reason}`, deleteMessageSeconds: (i.options.getInteger('delete_days') ?? 0) * 86400 });
    await i.reply(`🔨 Banned **${user.tag}** — ${reason}`);
    modLog(i.guild, { title: 'Member Banned', color: 0xed4245, fields: [
      { name: 'User', value: user.tag, inline: true }, { name: 'Mod', value: i.user.tag, inline: true }, { name: 'Reason', value: reason }] });
  },
};
