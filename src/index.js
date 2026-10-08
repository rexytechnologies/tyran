require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,        // privileged: enable in dev portal
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,      // privileged: enable in dev portal
  ],
  partials: [Partials.Message, Partials.Channel],
});

client.commands = new Collection();
for (const file of fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'))) {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
}

for (const file of fs.readdirSync(path.join(__dirname, 'events')).filter(f => f.endsWith('.js'))) {
  const evt = require(`./events/${file}`);
  client[evt.once ? 'once' : 'on'](evt.name, (...args) => evt.execute(...args, client));
}

client.login(process.env.DISCORD_TOKEN);
