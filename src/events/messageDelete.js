const modLog = require('../log');
module.exports = {
  name: 'messageDelete',
  execute(message) {
    if (!message.guild || message.author?.bot) return;
    modLog(message.guild, {
      title: 'Message Deleted', color: 0xfee75c,
      description: (message.content || '*no text content*').slice(0, 1000),
      fields: [
        { name: 'Author', value: message.author ? `${message.author.tag}` : 'Unknown', inline: true },
        { name: 'Channel', value: `${message.channel}`, inline: true },
      ],
    });
  },
};
