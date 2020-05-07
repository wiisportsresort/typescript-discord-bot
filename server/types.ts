import * as Discord from 'discord.js';

export interface GuildPrefs {
  prefix: string;
}

export interface CmdParams {
  msg: Discord.Message;
}