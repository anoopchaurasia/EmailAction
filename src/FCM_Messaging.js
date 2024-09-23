import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import ActivityProcess from './data/ActivityProcess';

const App = () => {
    // Request permission to receive notifications

    console.log("FCM ------------------------------------------------------- FCM")

    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    requestUserPermission();

    // Get FCM token
    const getToken = async () => {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    };

    getToken();

    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      ActivityProcess.processNew();
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    // Background message handler
    const unsubscribe_bg = messaging().setBackgroundMessageHandler(async remoteMessage => {
      ActivityProcess.processNew();
        console.log('Message handled in the background!', remoteMessage);
    });
    return unsubscribe;
};

export default App;