import { AttachmentField, Channel } from "./domain";

export const sumOfCount = (channels: Channel[]): number => {
  return channels.reduce((sum, channel) => {
    if (channel.count === undefined) {
      return sum;
    }
    return sum + channel.count;
  }, 0);
};

export const channelSort = (channels: Channel[]): Channel[] => {
  return channels.sort((a, b) => {
    if (a.count === undefined || b.count === undefined) {
      return 0;
    }
    if (a.count < b.count) {
      return 1;
    }
    if (a.count > b.count) {
      return -1;
    }
    return 0;
  });
};

export const channelToFields = (channels: Channel[]): AttachmentField[] => {
  return channels.map((channel, index) => {
    return {
      title: "",
      value:
        `${index + 1}位 <#${channel.id}> ` +
          "発言数： " +
          channel.count?.toString() || "",
    };
  });
};
