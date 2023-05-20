export type Channel = {
  id?: string;
  name?: string;
  count?: number;
};

export type Message = {
  bot_id?: string;
  subtype?: string;
};

export type AttachmentField = {
  title: string;
  value: string;
  short?: boolean;
};

export type PostData = {
  attachmentTitle: string;
  attachmentText: string;
  attachmentFields: Array<AttachmentField>;
};
