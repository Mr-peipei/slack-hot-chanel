import { App } from "@slack/bolt";
import { postMessage, getChannelMessage, getChannels } from "./slack";
import { AttachmentField, Channel } from "./domain";
import { DateTime } from "luxon";
import { channelSort, channelToFields, sumOfCount } from "./calc";
import {
  APP_PORT,
  SLACK_APP_TOKEN,
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
  TIME_ZONE,
} from "./env";

export const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: SLACK_APP_TOKEN,
  port: APP_PORT,
});

const main = async () => {
  const result: Channel[] = await getChannels();

  const yesterday = DateTime.local().setZone(TIME_ZONE).minus({ days: 1 });

  const yesterDayStart = yesterday.startOf("day").toSeconds().toString();
  const yesterDayEnd = yesterday.endOf("day").toSeconds().toString();

  const channels: (Channel | undefined)[] = await Promise.all(
    result.map(async (channel) => {
      if (channel.id === undefined) {
        return;
      }
      try {
        const message = await getChannelMessage(
          channel.id,
          yesterDayStart,
          yesterDayEnd
        );
        return { id: channel.id, name: channel.name, count: message.length };
      } catch (error) {
        return;
      }
    })
  );

  const filteredChannel: Channel[] = channels.filter(
    (channel): channel is Exclude<typeof channel, undefined> =>
      channel !== undefined
  );

  const sortedChannels: Channel[] = channelSort(filteredChannel);
  const counts: number = sumOfCount(filteredChannel);
  const fields: AttachmentField[] = channelToFields(sortedChannels);

  await postMessage({
    attachmentTitle:
      yesterday.toFormat("yyyy年MM月dd日") + "の発言数ランキング",
    attachmentText: "合計発言数: " + counts.toString(),
    attachmentFields: fields,
  });
};

main();
