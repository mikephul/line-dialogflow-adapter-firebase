import { get } from 'lodash';
import { MessageEvent } from '@line/bot-sdk';
import { LINE_VERIFY_TOKEN } from './config';
import { DialogflowClient } from './dialogflow-client';
import { STICKER } from './config';

export class MessageHandler {
  constructor(
    private readonly dialogflowClient: DialogflowClient) {
  }

  /**
   * All Message Handler
   */

  handleText = async (event: MessageEvent) => {
    const replyToken = get(event, 'replyToken');
    if (replyToken === LINE_VERIFY_TOKEN) return;
    const userId = get(event, ['source', 'userId']);
    const messageText = get(event, ['message', 'text']);
    const messages = await this.dialogflowClient.getMessage(userId, messageText);
    return messages;
  }

  handleNonText = async (event: MessageEvent, type: string) => {
    const message = get(event, 'message');
    const userId = get(event, ['source', 'userId']);
    const messages = await this.dialogflowClient.getEvent(userId, STICKER);
    // tslint:disable-next-line:no-console
    console.log(`Handle ${type}: ${JSON.stringify(message)}`);
    return messages;
  }
}
