// Basic AutoMod: invites, excessive caps, spam, banned words.
const { PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const modLog = require('../log');

const INVITE = /(discord\.gg|discord(app)?\.com\/invite)\/\S+/i;
const recent = new Map(); // `${guild}:${user}` -> timestamps

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!message.guild || message.author.bot) return;
    if (message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) return; // mods exempt

    const cfg = db.getGuild(message.guild.id).automod;
    let reason = null;

    if (cfg.invites && INVITE.test(message.content)) reason = 'Posting invite links';

    if (!reason && cfg.caps && message.content.length >= 12) {
      const letters = message.content.replace(/[^a-z]/gi, '');
      const upper = letters.replace(/[^A-Z]/g, '').length;
      if (letters.length >= 10 && upper / letters.length > 0.7) reason = 'Excessive caps';
    }

    if (!reason && cfg.badWords.length) {
      const lower = message.content.toLowerCase();
      if (cfg.badWords.some(w => lower.includes(w))) reason = 'Banned word';
    }

    if (!reason && cfg.spam) {
      const key = `${message.guild.id}:${message.author.id}`;
      const now = Date.now();
      const times = (recent.get(key) ?? []).filter(t => now - t < 5000);
      times.push(now);
      recent.set(key, times);
      if (times.length >= 6) reason = 'Spamming';
    }

    if (!reason) return;

    await message.delete().catch(() => {});
    const notice = await message.channel.send(`${message.author}, your message was removed: **${reason}**.`).catch(() => null);
    setTimeout(() => notice?.delete().catch(() => {}), 5000);
    modLog(message.guild, {
      title: 'AutoMod Action', color: 0xeb459e,
      fields: [
        { name: 'User', value: `${message.author.tag}`, inline: true },
        { name: 'Reason', value: reason, inline: true },
      ],
    });
  },
};
