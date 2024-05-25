import notifee, {AndroidColor} from '@notifee/react-native';
import { interpolate } from 'react-native-reanimated';
import MessageEvent from '../../event/MessageEvent';
import DataSync from './../../data/DataSync';
import MessageService from './../../realm/EmailMessageService';
// Start the foreground service with a notification
const startForegroundService = async () => {
let count = MessageService.readAll().length || 0, total=0;
    MessageEvent.on('user_logged_out', x=>{
      count = 0;
    })
    MessageEvent.on('new_message_received', (messages) => {
      console.log(messages.length, count);
        count += messages.length;
        register(count, total);
    });

    DataSync.getTotalEmails().then(data => {
        total = data.messagesTotal;
        register(count, total);
    }).catch(x => {
    });

    console.log("Starting foreground service to fetch messages");
  try {
      if(await notifee.isChannelCreated('message_foreground_channel')===false) {
        await notifee.requestPermission();
        await notifee.createChannel({
            id: 'message_foreground_channel',
            name: 'Default Channel',
        });
    }
    
    console.log("foreground service starting", "testing")
    register()
    console.log('Foreground service started with notification');
  } catch (error) {
    console.error('Error starting foreground service:', error);
  }
};

function register(count=0, total=0) {
  let indeterminate = true;
  
    if(count>0 && total>0) indeterminate=false; else indeterminate=true;
    notifee.displayNotification({
        title: 'Downloading Messages',
        id: "foreground_service_id",
        body: 'Downloading messages, you can start taking actions, download time depends on message count and network',
        android: {
          channelId:"message_foreground_channel",
          asForegroundService: true,
          progress: {
            max: total,
            current: count,
            indeterminate: indeterminate,
          },
        },
      });
}

// Call the function to start the foreground service
export default startForegroundService;
