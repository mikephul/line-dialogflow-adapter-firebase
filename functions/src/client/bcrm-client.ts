var request = require('request');
import { Message, MessageEvent } from '@line/bot-sdk';
import { Imessage } from './../interface/Imessage';
import { get } from 'lodash';
import { BcrmConfig } from './../types';


export class BcrmClient implements Imessage {
  private readonly user: string;
  private readonly pass: string;
  private readonly endPoint: string;

  constructor(config: BcrmConfig) {
    this.user = config.user;
    this.pass = config.pass;
    this.endPoint = config.endPoint
  }

  public replyMessage = (event: MessageEvent, message) => {
    const url = `https://${this.user}:${this.pass}@${this.endPoint}`;
    const userId = get(event, ['source', 'userId']);

    request.post({
      url,
      headers: {
        "Content-Type": "application/json"
      },
      body: this.buildBcrmMessage(userId, message)
    }, function (error, response, body) {
    });
  }

  private buildBcrmMessage = (id: string, message: any) => {
    const bodyText = `{
      "to":[
        "U337e7b12556b005130c45f9370ff046a"
      ],
        "messages":
          ${JSON.stringify(message)}
      }`
    return bodyText;
  }
}
