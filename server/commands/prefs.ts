import { CmdParams } from "../types";

export function prefs(params: CmdParams) {
  const { msg } = params;

  msg.channel.send('prefs command');
}