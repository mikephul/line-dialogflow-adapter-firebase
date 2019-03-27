var request = require('request');
import { Client, MessageEvent } from '@line/bot-sdk';
import { lineClientConfig, dialogflowClientConfig } from './../config';
import { Message } from '@line/bot-sdk';
import { Imessage } from './../interface/Imessage';
import { get } from 'lodash';

export class LineClient implements Imessage {
  private lineClient: Client;
  constructor() {
    this.lineClient = new Client(lineClientConfig);
  }

  public replyMessage(event: MessageEvent, message) {
    const replyToken = get(event, 'replyToken') as string;
    this.lineClient.replyMessage(replyToken, message);
  }
}
