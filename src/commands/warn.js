const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const modLog = require('../log');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn').setDescription('Warn a member')
    .addUserOption(o => o.setName('user').setDescription('Who').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),
  async execute(i) {
    const user = i.options.getUser('user');
    const reason = i.options.getString('reason');
    const total = db.addWarning(i.guild.id, user.id, { reason, mod: i.user.id, at: Date.now() });
    await i.reply(`⚠️ Warned **${user.tag}** (warning #${total}) — ${reason}`);
    user.send(`You were warned in **${i.guild.name}**: ${reason}`).catch(() => {});
    modLog(i.guild, { title: 'Member Warned', color: 0xfee75c, fields: [
      { name: 'User', value: user.tag, inline: true }, { name: 'Total', value: `${total}`, inline: true },
      { name: 'Mod', value: i.user.tag, inline: true }, { name: 'Reason', value: reason }] });
  },
};
