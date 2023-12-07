import React, { useEffect } from 'react';
import { View } from 'react-native';
import PushNotification from 'react-native-push-notification';

const NonClosableProgressNotification = () => {
  useEffect(() => {
    // Configure the ongoing progress notification
    PushNotification.localNotification({
      title: 'Ongoing Progress',
      message: 'Processing...',
      ongoing: true, // To keep the notification ongoing (non-dismissable)
      progress: {
        // Set progress properties
        max: 100, // Maximum value
        value: 30, // Current progress value (change this dynamically)
      },
    });

    return () => {
      // Clear the notification when the component unmounts
      PushNotification.cancelAllLocalNotifications();
    };
  }, []);

  return (
    // Your React Native component JSX
    // This component doesn't need to render anything related to the notification
    // It handles the notification logic separately
    // For example, you might render a blank <View> here
    <View></View>
  );
};

export default NonClosableProgressNotification;
