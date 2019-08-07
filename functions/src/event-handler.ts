import { get } from 'lodash';
import {
  Client,
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
  AccountLinkEvent,
} from '@line/bot-sdk';

import { LINE_FOLLOW, LINE_JOIN, LINE_BEACON, LINE_ACCOUNT_LINK, POSTBACK_EVENT_NAME_FIELD } from './config';
import { DialogflowClient } from './dialogflow-client';
import { MessageHandler } from './message-handler';

export class EventHandler {

  private readonly messageHandler: MessageHandler;

  constructor(
    private readonly lineClient: Client,
    private readonly dialogflowClient: DialogflowClient) {
    this.messageHandler = new MessageHandler(lineClient, dialogflowClient);
  }

  async handleEvent(event: EventBase) {
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

      case 'accountLink':
        return this.handleAccountLink(event as AccountLinkEvent);

      default:
        throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
  }

  private async handleMessage(event: MessageEvent) {
    const message: EventMessage = get(event, 'message');
    const messageType = get(message, 'type');
    switch (messageType) {
      case 'text':
        return this.messageHandler.handleText(event);
      case 'image':
        return this.messageHandler.handleImage(event);
      case 'video':
        return this.messageHandler.handleVideo(event);
      case 'audio':
        return this.messageHandler.handleAudio(event);
      case 'location':
        return this.messageHandler.handleLocation(event);
      case 'sticker':
        return this.messageHandler.handleSticker(event);
      default:
        throw new Error(`Unknown message: ${JSON.stringify(message)}`);
    }
  }

  private async handleFollow(event: FollowEvent) {
    const replyToken = get(event, 'replyToken');
    const userId = get(event, ['source', 'userId']);
    const lineMessages = await this.dialogflowClient.sendEvent(userId, LINE_FOLLOW);
    return this.lineClient.replyMessage(replyToken, lineMessages);
  }

  private async handleUnfollow(event: UnfollowEvent) {
    // Can't reply back with Dialogflow
    // tslint:disable-next-line:no-console
    console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
    return;
  }

  private async handleJoin(event: JoinEvent) {
    const replyToken = get(event, 'replyToken');
    const userId = get(event, ['source', 'userId']);
    const lineMessages = await this.dialogflowClient.sendEvent(userId, LINE_JOIN);
    return this.lineClient.replyMessage(replyToken, lineMessages);
  }

  private async handleLeave(event: LeaveEvent) {
    // Can't reply back with Dialogflow
    // tslint:disable-next-line:no-console
    console.log(`Left: ${JSON.stringify(event)}`);
    return;
  }

  private async handleBeacon(event: BeaconEvent) {
    const replyToken = get(event, 'replyToken');
    const userId = get(event, ['source', 'userId']);
    const lineMessages = await this.dialogflowClient.sendEvent(userId, LINE_BEACON);
    return this.lineClient.replyMessage(replyToken, lineMessages);
  }

  private async handleAccountLink(event: AccountLinkEvent) {
    const replyToken = get(event, 'replyToken');
    const userId = get(event, ['source', 'userId']);
    const lineMessages = await this.dialogflowClient.sendEvent(userId, LINE_ACCOUNT_LINK);
    return this.lineClient.replyMessage(replyToken, lineMessages);
  }

  private parsePostbackData(data: string) {
    const params = {};
    const vars = data.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      params[pair[0]] = pair[1];
    }
    return params;
  }

  private async handlePostback(event: PostbackEvent) {
    const replyToken = get(event, 'replyToken');
    const userId = get(event, ['source', 'userId']);
    const postback: Postback = get(event, 'postback');
    const data = get(postback, 'data');
    const params = this.parsePostbackData(data);
    const name = get(params, POSTBACK_EVENT_NAME_FIELD);
    delete params[POSTBACK_EVENT_NAME_FIELD];
    const lineMessages = await this.dialogflowClient.sendEvent(userId, name, params);
    return this.lineClient.replyMessage(replyToken, lineMessages);
  }

}
