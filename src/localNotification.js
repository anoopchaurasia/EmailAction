
import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Alert } from 'react-native';


// Function to request permissions
async function requestPermission() {
  const settings = await notifee.requestPermission();
  if (settings.authorizationStatus !== 1) {
    Alert.alert("Permission Denied", "You need to enable notifications to receive alerts.");
  }
}

async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'default-channel',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  }).then((x) => {
    console.log('Channel created', x);
  });
}


async function sendLocalNotification() {
  // Ensure the channel is created
  await requestPermission();
  await createNotificationChannel();

  // Display the notification
  await notifee.displayNotification({
    title: 'Hello! 🚀',
    body: 'This is a test notification!',
    localOnly: false,
    android: {
      channelId: 'default-channel',
      pressAction: {
        id: 'default',
      },
    },
  }).then((x) => {
    console.log('Notification displayed', x);
  });
}

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.DELIVERED) {
    console.log('Background notification intercepted:', detail.notification);

    // Handle notification without displaying it
    await notifee.cancelNotification(detail.notification.id);
  }
});


export default function App() {


  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.DELIVERED) {
        console.log('Notification intercepted:', detail.notification);

        // Handle the notification data inside the app
        handleCustomNotification(detail.notification);

        // Do not show the notification
        await notifee.cancelNotification(detail.notification.id);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  function handleCustomNotification(notification) {
    console.log('Handling notification inside the app:', notification);
    // Update UI, trigger actions, etc.
  }
  return (
    <View>
      <Button title="Send Notification" onPress={sendLocalNotification} />
    </View>
  );

}