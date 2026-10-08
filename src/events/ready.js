const { ActivityType } = require('discord.js');
module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('over the server', { type: ActivityType.Watching });
  },
};
