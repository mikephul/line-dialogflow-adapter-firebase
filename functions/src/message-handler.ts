import { get } from 'lodash';
import {
  Client,
  MessageEvent,
} from '@line/bot-sdk';

import { LINE_VERIFY_TOKEN, lineClientConfig } from './config';
import { DialogflowClient } from './dialogflow-client';
import { STICKER } from './config';




export class MessageHandler {
  constructor(
    private readonly dialogflowClient: DialogflowClient) {
  }

  /**
   * All Message Handler
   */
  async handleText(event: MessageEvent) {
    const replyToken = get(event, 'replyToken');
    if (replyToken === LINE_VERIFY_TOKEN) return;
    const userId = get(event, ['source', 'userId']);
    const messageText = get(event, ['message', 'text']);
    const messages = await this.dialogflowClient.getMessage(userId, messageText);
    return messages;
  }

  async handleImage(event: MessageEvent) {
    const message = get(event, 'message');
    const userId = get(event, ['source', 'userId']);
    const messages = await this.dialogflowClient.sendEvent(userId, STICKER);
    // tslint:disable-next-line:no-console
    console.log(`Handle Image: ${JSON.stringify(message)}`);
    return messages;
  }

  async handleVideo(event: MessageEvent) {
    const message = get(event, 'message');
    const userId = get(event, ['source', 'userId']);
    const messages = await this.dialogflowClient.sendEvent(userId, STICKER);
    // tslint:disable-next-line:no-console
    console.log(`Handle Video: ${JSON.stringify(message)}`);
    return messages;
  }

  async handleAudio(event: MessageEvent) {
    const message = get(event, 'message');
    const userId = get(event, ['source', 'userId']);
    const messages = await this.dialogflowClient.sendEvent(userId, STICKER);
    // tslint:disable-next-line:no-console
    console.log(`Handle Audio: ${JSON.stringify(message)}`);
    return messages;
  }

  async handleLocation(event: MessageEvent) {
    const message = get(event, 'message');
    const userId = get(event, ['source', 'userId']);
    const messages = await this.dialogflowClient.sendEvent(userId, STICKER);
    // tslint:disable-next-line:no-console
    console.log(`Handle Location: ${JSON.stringify(message)}`);
    return messages;
  }

  async handleSticker(event: MessageEvent) {
    const message = get(event, 'message');
    const userId = get(event, ['source', 'userId']);
    const messages = await this.dialogflowClient.sendEvent(userId, STICKER);
    // tslint:disable-next-line:no-console
    console.log(`Handle Sticker: ${JSON.stringify(message)}`);
    return messages;
  }

}
