const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info').setDescription('Info commands')
    .addSubcommand(s => s.setName('user').setDescription('About a user')
      .addUserOption(o => o.setName('user').setDescription('Who (default: you)')))
    .addSubcommand(s => s.setName('server').setDescription('About this server'))
    .addSubcommand(s => s.setName('ping').setDescription('Bot latency'))
    .setDMPermission(false),
  async execute(i) {
    const sub = i.options.getSubcommand();
    if (sub === 'ping') return i.reply(`🏓 ${i.client.ws.ping}ms`);
    if (sub === 'server') {
      const g = i.guild;
      return i.reply({ embeds: [new EmbedBuilder().setTitle(g.name).setThumbnail(g.iconURL()).setColor(0x5865f2).addFields(
        { name: 'Members', value: `${g.memberCount}`, inline: true },
        { name: 'Channels', value: `${g.channels.cache.size}`, inline: true },
        { name: 'Roles', value: `${g.roles.cache.size}`, inline: true },
        { name: 'Created', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:D>`, inline: true })] });
    }
    const user = i.options.getUser('user') ?? i.user;
    const m = await i.guild.members.fetch(user.id).catch(() => null);
    i.reply({ embeds: [new EmbedBuilder().setTitle(user.tag).setThumbnail(user.displayAvatarURL()).setColor(0x5865f2).addFields(
      { name: 'ID', value: user.id, inline: true },
      { name: 'Account created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
      ...(m ? [{ name: 'Joined', value: `<t:${Math.floor(m.joinedTimestamp / 1000)}:R>`, inline: true }] : []))] });
  },
};
