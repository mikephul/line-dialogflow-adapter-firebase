import { MessageEvent } from '@line/bot-sdk';

export interface Imessage {
  replyMessage(event: MessageEvent, message: any);
}
