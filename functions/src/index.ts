import * as functions from 'firebase-functions';
import { get } from 'lodash';
import { DialogflowClient } from './dialogflow-client';
import { dialogflowClientConfig } from './config';
import { EventHandler } from './event-handler';
import { LineMessageMapper } from './mapper/line-message-mapper';
import { LineClient } from './client/line-client';
import { Imessage } from './interface/Imessage';

const dialogflowClient = new DialogflowClient(dialogflowClientConfig);
const webhookHandler = new EventHandler(dialogflowClient);
const messageMapper = new LineMessageMapper();

export const webhook = functions.https.onRequest(async (req, res) => {
  const event = get(req, ['body', 'events', '0']);
  const message = await webhookHandler.handleEvent(event);
  const lineMessages = messageMapper.dialogflowToLine(message);
  const client: Imessage = new LineClient();
  client.replyMessage(event, lineMessages);
});
