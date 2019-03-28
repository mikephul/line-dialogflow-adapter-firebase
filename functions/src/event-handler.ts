import { get } from 'lodash';
import {
  EventBase,
  MessageEvent,
  FollowEvent,
  UnfollowEvent,
  Postback,
  JoinEvent,
  LeaveEvent,
  PostbackEvent,
  BeaconEvent,
  EventMessage,
} from '@line/bot-sdk';

import { LINE_FOLLOW, LINE_JOIN, LINE_BEACON, POSTBACK_EVENT_NAME_FIELD } from './config';
import { DialogflowClient } from './dialogflow-client';
import { MessageHandler } from './message-handler';

export class EventHandler {

  private readonly messageHandler: MessageHandler;

  constructor(
    private readonly dialogflowClient: DialogflowClient) {
    this.messageHandler = new MessageHandler(dialogflowClient);
  }

  handleEvent = (event: EventBase) => {
    const eventType = get(event, 'type');
    switch (eventType) {
      case 'message':
        return this.handleMessage(event as MessageEvent);

      case 'follow':
        return this.handleFollow(event as FollowEvent);

      case 'unfollow':
        return this.handleUnfollow(event as UnfollowEvent);

      case 'join':
        return this.handleJoin(event as JoinEvent);

      case 'leave':
        return this.handleLeave(event as LeaveEvent);

      case 'postback':
        return this.handlePostback(event as PostbackEvent);

      case 'beacon':
        return this.handleBeacon(event as BeaconEvent);

      default:
        throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
  }

  private handleMessage = (event: MessageEvent) => {
    const message: EventMessage = get(event, 'message') as EventMessage;
    const messageType = get(message, 'type');
    switch (messageType) {
      case 'text':
        return this.messageHandler.handleText(event);
      case 'image':
      case 'video':
      case 'audio':
      case 'location':
      case 'sticker':
        return this.messageHandler.handleNonText(event, messageType);
      default:
        throw new Error(`Unknown message: ${JSON.stringify(message)}`);
    }
  }

  private handleFollow = async (event: FollowEvent) => {
    const userId = get(event, ['source', 'userId']);
    const lineMessages = await this.dialogflowClient.getEvent(userId, LINE_FOLLOW);
    return lineMessages;
  }

  private handleUnfollow = (event: UnfollowEvent) => {
    // Can't reply back with Dialogflow
    // tslint:disable-next-line:no-console
    console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
    return;
  }

  private handleJoin = async (event: JoinEvent) => {
    const userId = get(event, ['source', 'userId']);
    const lineMessages = await this.dialogflowClient.getEvent(userId, LINE_JOIN);
    return lineMessages;
  }

  private handleLeave = async (event: LeaveEvent) => {
    // Can't reply back with Dialogflow
    // tslint:disable-next-line:no-console
    console.log(`Left: ${JSON.stringify(event)}`);
    return;
  }

  private handleBeacon = async (event: BeaconEvent) => {
    const userId = get(event, ['source', 'userId']);
    const lineMessages = await this.dialogflowClient.getEvent(userId, LINE_BEACON);
    return lineMessages;
  }

  private parsePostbackData = (data: string) => {
    const params = {};
    const vars = data.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      params[pair[0]] = pair[1];
    }
    return params;
  }

  private handlePostback = async (event: PostbackEvent) => {
    const userId = get(event, ['source', 'userId']);
    const postback: Postback = get(event, 'postback') as Postback;
    const data = get(postback, 'data') as string;
    const params = this.parsePostbackData(data);
    const name = get(params, POSTBACK_EVENT_NAME_FIELD);
    delete params[POSTBACK_EVENT_NAME_FIELD];
    const lineMessages = await this.dialogflowClient.getEvent(userId, name, params);
    return lineMessages;
  }

}
