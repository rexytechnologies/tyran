const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings').setDescription('View or clear a member\'s warnings')
    .addUserOption(o => o.setName('user').setDescription('Who').setRequired(true))
    .addBooleanOption(o => o.setName('clear').setDescription('Clear all their warnings'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),
  async execute(i) {
    const user = i.options.getUser('user');
    if (i.options.getBoolean('clear')) {
      db.clearWarnings(i.guild.id, user.id);
      return i.reply(`Cleared all warnings for **${user.tag}**.`);
    }
    const list = db.getWarnings(i.guild.id, user.id);
    if (!list.length) return i.reply({ content: `${user.tag} has no warnings.`, ephemeral: true });
    const embed = new EmbedBuilder().setTitle(`Warnings for ${user.tag}`).setColor(0xfee75c)
      .setDescription(list.slice(-10).map((w, n) => `**${n + 1}.** ${w.reason} — <@${w.mod}> <t:${Math.floor(w.at / 1000)}:R>`).join('\n'));
    i.reply({ embeds: [embed], ephemeral: true });
  },
};
