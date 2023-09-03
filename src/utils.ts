import channels from "./config/channels";

export function getChannelId(channelSlug: String): String {
  // @ts-ignore
  return channels[channelSlug];
}
