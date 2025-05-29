BackgroundService.sendMessageToJava("Hello from React Native!");

import { NativeModules, DeviceEventEmitter } from 'react-native';

const { BackgroundService } = NativeModules;

// Start the background service
BackgroundService.startService();

// Listen for messages from Java
DeviceEventEmitter.addListener('BackgroundMessage', (message) => {
    console.log('Message from Java:', message);
});
