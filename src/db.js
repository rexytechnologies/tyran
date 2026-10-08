// Tiny JSON-file store. Swap for SQLite/Postgres/Mongo when you outgrow it.
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'data.json');

let data = { guilds: {}, warnings: {} };
if (fs.existsSync(FILE)) {
  try { data = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { /* start fresh */ }
}

let timer = null;
const save = () => {
  clearTimeout(timer);
  timer = setTimeout(() => fs.writeFile(FILE, JSON.stringify(data, null, 2), () => {}), 250);
};

const defaults = {
  logChannel: null,
  welcomeChannel: null,
  welcomeMessage: 'Welcome {user} to **{server}**!',
  autoRole: null,
  automod: { invites: false, caps: false, spam: false, badWords: [] },
};

module.exports = {
  getGuild(id) {
    data.guilds[id] ??= structuredClone(defaults);
    return data.guilds[id];
  },
  addWarning(guildId, userId, entry) {
    const key = `${guildId}:${userId}`;
    (data.warnings[key] ??= []).push(entry);
    save();
    return data.warnings[key].length;
  },
  getWarnings: (guildId, userId) => data.warnings[`${guildId}:${userId}`] ?? [],
  clearWarnings(guildId, userId) { delete data.warnings[`${guildId}:${userId}`]; save(); },
  save,
};
