import { CmdParams } from "../types";

export function prefix(params: CmdParams) {
  const { msg } = params;

  msg.channel.send('prefix command');
}