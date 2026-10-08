const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const db = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup').setDescription('Configure the bot for this server')
    .addSubcommand(s => s.setName('logs').setDescription('Set the mod-log channel')
      .addChannelOption(o => o.setName('channel').setDescription('Channel').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(s => s.setName('welcome').setDescription('Set the welcome channel/message')
      .addChannelOption(o => o.setName('channel').setDescription('Channel').addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addStringOption(o => o.setName('message').setDescription('Use {user} {username} {server} {count}')))
    .addSubcommand(s => s.setName('autorole').setDescription('Role given to new members')
      .addRoleOption(o => o.setName('role').setDescription('Role (omit to disable)')))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
  async execute(i) {
    const cfg = db.getGuild(i.guild.id);
    const sub = i.options.getSubcommand();
    if (sub === 'logs') cfg.logChannel = i.options.getChannel('channel').id;
    if (sub === 'welcome') {
      cfg.welcomeChannel = i.options.getChannel('channel').id;
      const msg = i.options.getString('message');
      if (msg) cfg.welcomeMessage = msg;
    }
    if (sub === 'autorole') {
      const role = i.options.getRole('role');
      if (role && role.position >= i.guild.members.me.roles.highest.position)
        return i.reply({ content: 'That role is above my highest role, so I can\'t assign it.', ephemeral: true });
      cfg.autoRole = role?.id ?? null;
    }
    db.save();
    i.reply({ content: 'Saved ✅', ephemeral: true });
  },
};
