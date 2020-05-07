import * as Discord from 'discord.js';
import { guildPrefs } from '.';
import { GuildPrefs } from './types';
import commands from './commands';

const defaultPrefs: GuildPrefs = {
  prefix: '%',
};

export default async function (msg: Discord.Message) {
  const guildId = msg.guild?.id;

  if (msg.author.bot) return; // do not respond to other bots
  if (!guildId) return; // do not respond to DMs

  // set default config
  guildPrefs.setIfUnset(guildId, defaultPrefs);

  const prefix = guildPrefs.get(guildId)?.prefix as string;

  // make sure message starts with prefix
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.substr(prefix.length).split(' ');
  const cmd = args.shift() as string;

  // exit if no command, like "%"
  if (!cmd) return;

  if (Object.prototype.hasOwnProperty.call(commands, cmd)) commands[cmd]({ msg });
}
