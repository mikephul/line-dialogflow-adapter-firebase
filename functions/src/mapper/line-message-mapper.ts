import { get } from 'lodash';
import { Message } from '@line/bot-sdk';
import { structProtoToJson } from './../structjson';

export class LineMessageMapper {
  dialogflowToLine = (dialogflowMessages) => {
    const lineMessages = dialogflowMessages
      .filter(messages => get(messages, ['platform']) === 'LINE')
      .map(message => this.filterMessageType(message));

    return lineMessages;
  }

  filterMessageType = (message) => {
    const messageType = get(message, 'message');
    let messegeText: Message;
    if (messageType === 'text') {
      messegeText = {
        type: 'text',
        text: get(message, ['text', 'text', '0']),
      };
    } else if (messageType === 'payload') {
      let payload = get(message, ['payload']);
      payload = structProtoToJson(payload);
      messegeText = get(payload, 'line');
    }

    return messegeText;
  }
}
