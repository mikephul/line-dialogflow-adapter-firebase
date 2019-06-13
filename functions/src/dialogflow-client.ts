import dialogflow from 'dialogflow';
import { get } from 'lodash';
import { Message, MessageEvent } from '@line/bot-sdk';

import { structProtoToJson, jsonToStructProto } from './structjson';
import { DialogflowConfig } from './types';
import { LINE_MEDIA } from './config';

export class DialogflowClient {

  private readonly sessionClient: any;
  private readonly projectId: string;
  private readonly languageCode: string;

  constructor(config: DialogflowConfig) {
    this.sessionClient = new dialogflow.SessionsClient();
    this.projectId = config.projectId;
    this.languageCode = config.languageCode;
  }

  public async sendText(sessionId: string, text: string, originalEvent: MessageEvent) {
    const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
    const req = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: this.languageCode,
        },
      },
      queryParams: {
        payload: jsonToStructProto({
          data: JSON.stringify(originalEvent),
          source: 'line',
        }),
      },
    };
    const messages = await this.getDialogflowMessages(req);
    return this.dialogflowMessagesToLineMessages(messages);
  }

  async sendMediaEvent(sessionId: string, originalEvent: MessageEvent) {
    const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
    const req = {
      session: sessionPath,
      queryInput: {
        event: {
          name: LINE_MEDIA,
          languageCode: this.languageCode,
        },
      },
      queryParams: {
        payload: jsonToStructProto({
          data: JSON.stringify(originalEvent),
          source: 'line',
        }),
      },
    };
    const messages = await this.getDialogflowMessages(req);
    return this.dialogflowMessagesToLineMessages(messages);
  }

  async sendEvent(sessionId: string, name: string, parameters = {}) {
    const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
    const req = {
      session: sessionPath,
      queryInput: {
        event: {
          name,
          parameters: jsonToStructProto(parameters),
          languageCode: this.languageCode,
        },
      },
    };
    const messages = await this.getDialogflowMessages(req);
    return this.dialogflowMessagesToLineMessages(messages);
  }

  private dialogflowMessagesToLineMessages(dialogflowMessages) {
    const lineMessages: Message[] = [];
    for (let i = 0; i < dialogflowMessages.length; i++) {
      const messageType = get(dialogflowMessages[i], 'message');
      let message: Message;
      if (messageType === 'text') {
        message = {
          type: 'text',
          text: get(dialogflowMessages[i], ['text', 'text', '0']),
        };
        lineMessages.push(message);
      } else if (messageType === 'payload') {
        let payload = get(dialogflowMessages[i], ['payload']);
        payload = structProtoToJson(payload);
        message = get(payload, 'line');
        lineMessages.push(message);
      }
    }
    return lineMessages;
  }

  private async getDialogflowMessages(req) {
    const res = await this.sessionClient.detectIntent(req);
    const result = get(res, ['0', 'queryResult']);
    return get(result, 'fulfillmentMessages');
  }

}
