import { CmdParams } from "../types";

export function help(params: CmdParams) {
  const { msg } = params;

  msg.channel.send('help command');
}