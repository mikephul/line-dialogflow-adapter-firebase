import { Client, MessageEvent } from '@line/bot-sdk';
import { lineClientConfig } from './../config';
import { Imessage } from './../interface/Imessage';
import { get } from 'lodash';

export class LineClient implements Imessage {
  private lineClient: Client;
  constructor() {
    this.lineClient = new Client(lineClientConfig);
  }

  public replyMessage = (event: MessageEvent, message) => {
    const replyToken = get(event, 'replyToken') as string;
    this.lineClient.replyMessage(replyToken, message).catch((err) => {
      throw new Error("reply message error");
    });
  }
}
