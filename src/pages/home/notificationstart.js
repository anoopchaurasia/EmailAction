import notifee, {AndroidColor} from '@notifee/react-native';
import MessageEvent from '../../event/MessageEvent';
import DataSync from './../../data/DataSync';
import MessageService from './../../realm/EmailMessageService';
// Start the foreground service with a notification
const startForegroundService = async () => {
let count = MessageService.readAll().length || 0, total=0;
    MessageEvent.on('new_message_received', (messages) => {
        count += messages.length;
        register(count, total);
    });

    DataSync.getTotalEmails().then(data => {
        total = data.messagesTotal;
        register(count, total);
    }).catch(x => {
    });

    console.log("startForegroundServicestartForegroundServicestartForegroundServicestartForegroundServicestartForegroundService")
  try {
      if(await notifee.isChannelCreated('my-channel-id')===false) {
        await notifee.requestPermission();
        await notifee.createChannel({
            id: 'my-channel-id',
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
    if(count>0 && total>0) indeterminate=false; else indeterminate=true;
    notifee.displayNotification({
        title: 'Foreground service',
        id: "notification_id",
        body: 'This notification will exist for the lifetime of the service runner',
        android: {
          channelId:"my-channel-id",
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
