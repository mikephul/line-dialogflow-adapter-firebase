import { get } from 'lodash';
import { Message, TextMessage } from '@line/bot-sdk';
import { structProtoToJson, jsonToStructProto } from './../structjson';

export class LineMessageMapper {
  dialogflowToLine(dialogflowMessages) {
    let lineMessages = dialogflowMessages
      .filter(messages => get(messages, ['platform']) === 'LINE')
      .map(message => this.filterMessageType(message));

    return lineMessages;
  }

  filterMessageType(message) {
    const messageType = get(message, 'message');
    let messegeText: Message;
    if (messageType === 'text') {
      messegeText = {
        type: 'text',
        text: get(message, ['text', 'text', '0']),
      };
      return messegeText;
    } else if (messageType === 'payload') {
      let payload = get(message, ['payload']);
      payload = structProtoToJson(payload);
      messegeText = get(payload, 'line');
      return messegeText;
    }
    return messegeText;
  }

}