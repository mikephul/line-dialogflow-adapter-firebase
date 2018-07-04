# Line-Dialogflow Adapter for Firebase Functions 

Line-Dialogflow Adapter helps pass events from [Line Messaging API](https://developers.line.me/en/docs/messaging-api/overview/) to [Dialogflow](https://dialogflow.com/). Normally, the events such as [Follow event](https://developers.line.me/en/docs/messaging-api/reference/#follow-event) and [Postback event](https://developers.line.me/en/docs/messaging-api/reference/#postback-event) are not supported out-of-the-box by Dialogflow yet. Hence, the bot can only send text query to get the response from Dialogflow. This code seeks to translate [Line webhook events](https://developers.line.me/en/docs/messaging-api/reference/#webhook-event-objects) to Dialogflow custom events. Click [here](http://qr-official.line.me/L/oVd9bvJ4qG.png) to see the bot in action.

__*Note:__ This code will deploy the adapter on [Firebase Cloud Functions](https://firebase.google.com/docs/functions/)


## Quickstart

1. Create a bot in [Dialogflow](https://dialogflow.com/). Remember your `project-id` and `language`. No need to set up the Integrations for Line.
2. Enable the [Dialogflow API](https://console.cloud.google.com/flows/enableapi?apiid=dialogflow.googleapis.com) in Google Cloud console for your project.
3. Initialize [Firebase](https://console.firebase.google.com/) project
```
cd line-dialogflow-adapter-firebase
firebase init
```
and select your `project-id` to match your Dialogflow project.

4. Obtain the channel access token of your Line bot from [Line Developer console](https://developers.line.me/console/).

5. Set up the config with
```
firebase functions:config:set line.channel_access_token="your-channel-access-token" dialogflow.project_id="your-project-id" dialogflow.language_code="your-language"
```
6. Deploy the function with
```
firebase deploy --only functions
```
You should get the URL of your function as `https://us-central1-your-project-id.cloudfunctions.net/webhook` and the link will also show up at your [Firebase Functions Dashboard](https://console.firebase.google.com/).

7. Go to your [Firebase console](https://console.firebase.google.com/). Select the Blaze pricing plan. Firebase function would not allow external API call using free plan 😱.

8. Go to the [Line Channel Setting](https://developers.line.me/console/) of your bot. 
	- Enable webhook and add the Webhook URL to point to `https://us-central1-your-project-id.cloudfunctions.net/webhook`. 
	- Disable Auto-reply messages and Greeting messages
	
9. Go to Dialogflow console. For `Default Welcome Intent`, add `LINE_FOLLOW` event to greet your audience from Dialogflow!   

## Line webhook event to Dialogflow event
- __Message event__ is simply sent to Dialogflow as text. 
- __Follow, Join, Beacon event__ are sent as custom Dialogflow events below:

|  Line  |  Dialogflow |
|:------:|:-----------:|
| Follow | `LINE_FOLLOW` |
|  Join  |  `LINE_JOIN`  |
| Beacon | `LINE_BEACON` |

- __Postback event__ are sent as `<EVENT_NAME>` to Dialogflow with all the followed parameters. The parameters may be used in the Dialogflow responses as `#your_event_name.param` (ie. `My store id is #your_event_name.storeid` will return `My store id is 1234` from the example below).
```
{  
   "type":"postback",
   "replyToken":"b60d432864f44d079f6d8efe86cf404b",
   "source":{  
      "userId":"U91eeaf62d...",
      "type":"user"
   },
   "timestamp":1513669370317,
   "postback":{  
      "data":"action=<EVENT NAME>&storeid=1234",
      "params":{  
         "datetime":"2017-12-25T01:00"
      }
   }
}
```

Feel free to customize the name of the predefined Dialogflow events and `<EVENT_NAME>` selector (default is `action`) in `config.ts`.

### Documentation
- [View Line webhook event](https://developers.line.me/en/docs/messaging-api/reference/#common-properties)
- [View Dialogflow event](https://dialogflow.com/docs/events)
