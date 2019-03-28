import * as functions from 'firebase-functions';
import { ClientConfig } from '@line/bot-sdk';

import { DialogflowConfig } from './types';

export const lineClientConfig: ClientConfig = {
  channelAccessToken: functions.config().line.channel_access_token,
};

export const dialogflowClientConfig: DialogflowConfig = {
  projectId: functions.config().dialogflow.project_id,
  languageCode: functions.config().dialogflow.language_code,
};

// Verify token from line when initiate webhook
export const LINE_VERIFY_TOKEN = '00000000000000000000000000000000';

// Field in Postback data that specified the Dialogflow event name
export const POSTBACK_EVENT_NAME_FIELD = 'action';

// Event Name for Dialogflow
export const LINE_FOLLOW = 'LINE_FOLLOW';
export const LINE_JOIN = 'LINE_JOIN';
export const LINE_BEACON = 'LINE_BEACON';
export const STICKER = 'STICKER';

