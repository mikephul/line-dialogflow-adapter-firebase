// import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { get } from 'lodash';
import { DialogflowClient } from './dialogflow-client';
import { dialogflowClientConfig } from './config';
import { EventHandler } from './event-handler';
import { LineMessageMapper } from './mapper/line-message-mapper';
import { LineClient } from './client/line-client';

const app = express();
app.use(bodyParser.json());
const dialogflowClient = new DialogflowClient(dialogflowClientConfig);
const webhookHandler = new EventHandler(dialogflowClient);
const messageMapper = new LineMessageMapper();
const client = new LineClient();

app.post('/webhook', async (req, res, next) => {
  const event = get(req, ['body', 'events', '0']);
  try {
    const message = await webhookHandler.handleEvent(event);
    const lineMessages = messageMapper.dialogflowToLine(message);
    client.replyMessage(event, lineMessages);
  } catch (err) {
    next(err);
  }
  return res.sendStatus(200);
});

const port = 5000
app.listen(port);
