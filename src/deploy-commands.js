require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = fs.readdirSync(path.join(__dirname, 'commands'))
  .filter(f => f.endsWith('.js'))
  .map(f => require(`./commands/${f}`).data.toJSON());

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
const { CLIENT_ID, GUILD_ID } = process.env;

(async () => {
  const route = GUILD_ID
    ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
    : Routes.applicationCommands(CLIENT_ID);
  await rest.put(route, { body: commands });
  console.log(`Registered ${commands.length} commands ${GUILD_ID ? '(guild)' : '(global)'}.`);
})();
