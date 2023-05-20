import { app } from "./app";
import { AttachmentField, Channel, Message, PostData } from "./domain";
import {
  POST_AUTHOR_NAME,
  POST_CHANNEL_ID,
  RANKING_COUNT,
  SLACK_BOT_TOKEN,
} from "./env";

export const getChannels = async (): Promise<Channel[]> => {
  try {
    const result = await app.client.conversations.list({
      token: SLACK_BOT_TOKEN,
    });
    if (result.channels === undefined) {
      return [];
    }
    return result.channels;
  } catch (error) {
    throw error;
  }
};

export const getChannelMessage = async (
  channelId: string
): Promise<Message[]> => {
  try {
    const result = await app.client.conversations.history({
      token: SLACK_BOT_TOKEN,
      channel: channelId,
    });
    if (result.messages === undefined) {
      return [];
    }
    return result.messages;
  } catch (error) {
    throw error;
  }
};

export const postMessage = async ({
  attachmentTitle,
  attachmentText,
  attachmentFields,
}: PostData): Promise<void> => {
  try {
    await app.client.chat.postMessage({
      token: SLACK_BOT_TOKEN,
      channel: POST_CHANNEL_ID,
      attachments: [
        {
          author_name: POST_AUTHOR_NAME,
          title: attachmentTitle,
          text: attachmentText,
          fields: attachmentFields.slice(0, RANKING_COUNT),
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};
