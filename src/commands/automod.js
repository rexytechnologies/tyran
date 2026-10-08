const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod').setDescription('Configure automod')
    .addSubcommand(s => s.setName('toggle').setDescription('Turn a filter on/off')
      .addStringOption(o => o.setName('filter').setDescription('Which filter').setRequired(true)
        .addChoices({ name: 'Invite links', value: 'invites' }, { name: 'Excessive caps', value: 'caps' }, { name: 'Spam', value: 'spam' }))
      .addBooleanOption(o => o.setName('enabled').setDescription('On or off').setRequired(true)))
    .addSubcommand(s => s.setName('addword').setDescription('Ban a word')
      .addStringOption(o => o.setName('word').setDescription('Word/phrase').setRequired(true)))
    .addSubcommand(s => s.setName('removeword').setDescription('Unban a word')
      .addStringOption(o => o.setName('word').setDescription('Word/phrase').setRequired(true)))
    .addSubcommand(s => s.setName('status').setDescription('Show current settings'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
  async execute(i) {
    const cfg = db.getGuild(i.guild.id).automod;
    const sub = i.options.getSubcommand();
    if (sub === 'toggle') {
      cfg[i.options.getString('filter')] = i.options.getBoolean('enabled');
      db.save();
      return i.reply({ content: `Updated **${i.options.getString('filter')}** → ${i.options.getBoolean('enabled') ? 'on' : 'off'}.`, ephemeral: true });
    }
    if (sub === 'addword') {
      const w = i.options.getString('word').toLowerCase();
      if (!cfg.badWords.includes(w)) cfg.badWords.push(w);
      db.save();
      return i.reply({ content: 'Word added.', ephemeral: true });
    }
    if (sub === 'removeword') {
      cfg.badWords = cfg.badWords.filter(w => w !== i.options.getString('word').toLowerCase());
      db.save();
      return i.reply({ content: 'Word removed.', ephemeral: true });
    }
    i.reply({ ephemeral: true, content:
      `**AutoMod**\nInvites: ${cfg.invites}\nCaps: ${cfg.caps}\nSpam: ${cfg.spam}\nBanned words: ${cfg.badWords.length}` });
  },
};
