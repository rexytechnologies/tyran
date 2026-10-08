const db = require('../db');
const modLog = require('../log');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const cfg = db.getGuild(member.guild.id);

    if (cfg.autoRole) {
      const role = member.guild.roles.cache.get(cfg.autoRole);
      if (role) member.roles.add(role).catch(() => {});
    }

    if (cfg.welcomeChannel) {
      const ch = member.guild.channels.cache.get(cfg.welcomeChannel);
      const text = cfg.welcomeMessage
        .replaceAll('{user}', `${member}`)
        .replaceAll('{username}', member.user.username)
        .replaceAll('{server}', member.guild.name)
        .replaceAll('{count}', member.guild.memberCount);
      ch?.send(text).catch(() => {});
    }

    modLog(member.guild, {
      title: 'Member Joined', color: 0x57f287,
      fields: [{ name: 'User', value: `${member.user.tag} (${member.id})` }],
    });
  },
};
