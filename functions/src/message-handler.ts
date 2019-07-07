import { get } from 'lodash';
import {
  Client,
  MessageEvent,
  TextMessage,
} from '@line/bot-sdk';

import { LINE_VERIFY_TOKEN } from './config';
import { DialogflowClient } from './dialogflow-client';


export class MessageHandler {

  constructor(
    private readonly lineClient: Client,
    private readonly dialogflowClient: DialogflowClient) {
  }

  /**
   * All Message Handler
   */
  async handleText(event: MessageEvent) {
    const replyToken = get(event, 'replyToken');
    if (replyToken === LINE_VERIFY_TOKEN) return;
    const userId = get(event, ['source', 'userId']);
    const message = get(event, 'message');
    const messageText = get(message, 'text');
    const lineMessages = await this.dialogflowClient.sendText(userId, messageText, event);
    const lineTextMessage = lineMessages[0] as TextMessage;
    if (lineTextMessage.text !== '') {
      this.lineClient.replyMessage(replyToken, lineMessages);
    }
    return;
  }

  async handleImage(event: MessageEvent) {
    const message = get(event, 'message');
    // tslint:disable-next-line:no-console
    console.log(`Handle Image: ${JSON.stringify(message)}`);
    return;
  }

  async handleVideo(event: MessageEvent) {
    const message = get(event, 'message');
    // tslint:disable-next-line:no-console
    console.log(`Handle Video: ${JSON.stringify(message)}`);
    return;
  }

  async handleAudio(event: MessageEvent) {
    const message = get(event, 'message');
    // tslint:disable-next-line:no-console
    console.log(`Handle Audio: ${JSON.stringify(message)}`);
    return;
  }

  async handleLocation(event: MessageEvent) {
    const message = get(event, 'message');
    // tslint:disable-next-line:no-console
    console.log(`Handle Location: ${JSON.stringify(message)}`);
    return;
  }

  async handleSticker(event: MessageEvent) {
    const message = get(event, 'message');
    // tslint:disable-next-line:no-console
    console.log(`Handle Sticker: ${JSON.stringify(message)}`);
    return;
  }

}
