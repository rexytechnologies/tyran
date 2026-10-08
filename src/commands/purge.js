const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge').setDescription('Bulk delete recent messages')
    .addIntegerOption(o => o.setName('amount').setDescription('1-100').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption(o => o.setName('user').setDescription('Only delete this user\'s messages'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),
  async execute(i) {
    const amount = i.options.getInteger('amount');
    const target = i.options.getUser('user');
    await i.deferReply({ ephemeral: true });
    let msgs = await i.channel.messages.fetch({ limit: 100 });
    if (target) msgs = msgs.filter(m => m.author.id === target.id);
    const deleted = await i.channel.bulkDelete([...msgs.values()].slice(0, amount), true);
    i.editReply(`🧹 Deleted ${deleted.size} message(s). (Messages older than 14 days can't be bulk deleted.)`);
  },
};
