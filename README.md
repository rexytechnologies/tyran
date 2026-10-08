<div align="center">

# 🛡️ Tyran

**A multipurpose Discord moderation bot — slash commands, AutoMod, mod logs, and welcome tools.**

![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

---

## ✨ Features

- 🔨 **Moderation** — ban, kick, timeout, warn, and bulk purge, with role-hierarchy checks
- 🤖 **AutoMod** — invite links, excessive caps, spam, and a custom banned-word list
- 📜 **Mod logs** — joins, leaves, deleted messages, and every moderator action
- 👋 **Welcome & autorole** — custom welcome messages and a role for new members
- ℹ️ **Info commands** — user, server, and latency lookups
- ⚡ **Slash commands only** — permissions are enforced by Discord itself

## 📋 Commands

### Moderation

| Command | Description | Permission |
|---|---|---|
| `/ban <user> [reason] [delete_days]` | Ban a member, optionally deleting 0–7 days of messages | Ban Members |
| `/kick <user> [reason]` | Kick a member | Kick Members |
| `/timeout <user> <minutes> [reason]` | Mute a member for up to 28 days | Moderate Members |
| `/warn <user> <reason>` | Warn a member and DM them | Moderate Members |
| `/warnings <user> [clear]` | View the last 10 warnings, or clear them all | Moderate Members |
| `/purge <amount> [user]` | Bulk delete 1–100 recent messages | Manage Messages |

### AutoMod

| Command | Description |
|---|---|
| `/automod toggle <filter> <enabled>` | Turn the `invites`, `caps`, or `spam` filter on or off |
| `/automod addword <word>` | Add a word or phrase to the banned list |
| `/automod removeword <word>` | Remove a word or phrase |
| `/automod status` | Show current AutoMod settings |

### Server setup

| Command | Description |
|---|---|
| `/setup logs <channel>` | Set the mod-log channel |
| `/setup welcome <channel> [message]` | Set the welcome channel and message |
| `/setup autorole [role]` | Role given to new members (leave empty to disable) |

Welcome message placeholders: `{user}` `{username}` `{server}` `{count}`

### Info

| Command | Description |
|---|---|
| `/info user [user]` | ID, account age, and join date |
| `/info server` | Member, channel, and role counts |
| `/info ping` | Bot latency |

## 🚀 Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A Discord application and bot token from the [Developer Portal](https://discord.com/developers/applications)

### 1. Create the bot

1. In the Developer Portal, create an application and add a **Bot**.
2. Under **Bot → Privileged Gateway Intents**, enable:
   - **Server Members Intent**
   - **Message Content Intent**
3. Copy the bot token and the application (client) ID.

### 2. Install

```bash
git clone https://github.com/rexytechnologies/tyran.git
cd tyran
npm install
cp .env.example .env
```

Edit `.env`:

```env
DISCORD_TOKEN=your-bot-token
CLIENT_ID=your-application-id
GUILD_ID=            # optional: your test server, for instant command updates
```

### 3. Register commands and run

```bash
npm run deploy   # registers slash commands
npm start
```

Global commands can take up to an hour to appear. Set `GUILD_ID` while developing for instant updates.

### 4. Invite Tyran

In the Developer Portal go to **OAuth2 → URL Generator**, select the scopes `bot` and `applications.commands`, and grant these permissions:

`View Channels` · `Send Messages` · `Embed Links` · `Manage Messages` · `Manage Roles` · `Kick Members` · `Ban Members` · `Moderate Members`

> **Tip:** put Tyran's role above any role it needs to assign or moderate.

## 🗂️ Project structure

```
tyran/
├── src/
│   ├── commands/            # One file per slash command
│   ├── events/              # Gateway event handlers
│   ├── db.js                # JSON-file storage layer
│   ├── log.js               # Mod-log helper
│   ├── deploy-commands.js   # Registers slash commands
│   └── index.js             # Entry point
├── .env.example
└── package.json
```

## ➕ Adding a command

Create a file in `src/commands/` that exports a `data` builder and an `execute` function:

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('hello').setDescription('Say hi'),
  async execute(interaction) {
    await interaction.reply('Hello!');
  },
};
```

Then run `npm run deploy`. Events work the same way in `src/events/`.

## 💾 Storage

Settings and warnings are saved to `data.json` in the project root (git-ignored). That's fine for a handful of servers; swap out `src/db.js` for SQLite or Postgres if you need more.

## 🗺️ Roadmap

- [ ] Reaction roles
- [ ] Custom commands / tags
- [ ] Temp-bans and timed mutes
- [ ] `/unban`, `/slowmode`, `/lock`
- [ ] Leveling
- [ ] Web dashboard

## 🤝 Contributing

Pull requests are welcome. For larger changes, open an issue first so we can talk it through.

## 📄 License

Released under the [MIT License](LICENSE).
