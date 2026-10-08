const { EmbedBuilder } = require('discord.js');
const db = require('./db');

module.exports = async function modLog(guild, { title, color = 0x5865f2, fields = [], description }) {
  const id = db.getGuild(guild.id).logChannel;
  if (!id) return;
  const channel = guild.channels.cache.get(id);
  if (!channel?.isTextBased()) return;
  const embed = new EmbedBuilder().setTitle(title).setColor(color).addFields(fields).setTimestamp();
  if (description) embed.setDescription(description);
  channel.send({ embeds: [embed] }).catch(() => {});
};
