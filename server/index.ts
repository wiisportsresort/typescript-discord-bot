import * as ch from 'chalk';
import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';
import * as path from 'path';

import messageHandler from './bot';
import { Store } from './store';
import { GuildPrefs } from './types';

dotenv.config();

export const client = new Discord.Client();

export const guildPrefs = new Store<GuildPrefs>({
  path: path.join(process.cwd(), 'data/guildprefs.json'),
  writeOnSet: true,
});

client
  .on('ready', () => {
    console.log(ch`{green ${client.user?.tag} connected!}`);
    client.user?.setPresence({
      activity: {
        name: 'your mom',
        type: 'PLAYING',
      },
      status: 'online',
    });
  })
  .on('disconnect', () => {
    console.log(ch`Bot disconnected.`);
  })
  .on('debug', console.debug);

client.on('message', messageHandler);

client.login(process.env.TOKEN);
