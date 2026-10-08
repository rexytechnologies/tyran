const modLog = require('../log');
module.exports = {
  name: 'guildMemberRemove',
  execute(member) {
    modLog(member.guild, {
      title: 'Member Left', color: 0xed4245,
      fields: [{ name: 'User', value: `${member.user.tag} (${member.id})` }],
    });
  },
};
