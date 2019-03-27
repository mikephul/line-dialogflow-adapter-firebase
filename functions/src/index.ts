// import * as functions from 'firebase-functions';
import { get } from 'lodash';

import { Client, middleware, TextEventMessage, Message } from '@line/bot-sdk';

import { DialogflowClient } from './dialogflow-client';
import { lineClientConfig, dialogflowClientConfig, bcrmConfig } from './config';
import { EventHandler } from './event-handler';
import { LineMessageMapper } from './mapper/line-message-mapper';
import { BcrmClient } from './client/bcrm-client';
import { LineClient } from './client/line-client';
import { Imessage } from './interface/Imessage';

//express
const express = require("express");
const app = express();

const dialogflowClient = new DialogflowClient(dialogflowClientConfig);
const webhookHandler = new EventHandler(dialogflowClient);
const messageMapper = new LineMessageMapper();

// export const webhook = functions.https.onRequest(async (req, res) => {
//   const event = get(req, ['body', 'events', '0']);
//   await webhookHandler.handleEvent(event);
//   res.send('');
// });

const config = {
  channelAccessToken: lineClientConfig.channelAccessToken,
  channelSecret: lineClientConfig.channelSecret
};

app.post('/webhook', middleware(config), async (req, res) => {
  const event = get(req, ['body', 'events', '0']);
  const message = await webhookHandler.handleEvent(event);
  const lineMessages = messageMapper.dialogflowToLine(message);
  // const client: Imessage = new LineClient();

  const client: Imessage = new BcrmClient(bcrmConfig);
  client.replyMessage(event, lineMessages)
});


app.listen(3000, () => console.log("Server listening on port 3000!"));

