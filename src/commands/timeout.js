const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const modLog = require('../log');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout').setDescription('Mute a member for a while')
    .addUserOption(o => o.setName('user').setDescription('Who').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Duration in minutes (max 40320)').setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),
  async execute(i) {
    const member = i.options.getMember('user');
    const mins = i.options.getInteger('minutes');
    const reason = i.options.getString('reason') ?? 'No reason provided';
    if (!member?.moderatable) return i.reply({ content: "I can't timeout that user.", ephemeral: true });

    await member.timeout(mins * 60_000, `${i.user.tag}: ${reason}`);
    await i.reply(`🔇 Timed out **${member.user.tag}** for ${mins} min — ${reason}`);
    modLog(i.guild, { title: 'Member Timed Out', color: 0xf0b232, fields: [
      { name: 'User', value: member.user.tag, inline: true }, { name: 'Duration', value: `${mins} min`, inline: true },
      { name: 'Mod', value: i.user.tag, inline: true }, { name: 'Reason', value: reason }] });
  },
};
