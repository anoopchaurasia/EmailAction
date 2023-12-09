// YourForegroundService.js

import { Platform } from 'react-native';
import notifee from '@notifee/react-native';
import ActivityProcess from '../../data/ActivityProcess';


const YourForegroundService = () => {
  if (Platform.OS === 'android') {
    console.log(Platform.OS, "Platform.OS");
    notifee.registerForegroundService(async ({ id }) => {
      return new Promise((resolve) => {
        console.log(" ActivityProcess.processNew(x=>{ ActivityProcess.processNew(x=>{")
        ActivityProcess.processNew(x=>{
          console.log("process completed, marking done");
           notifee.stopForegroundService().then(x=>{
            resolve()
           })
        });
      });
    });
  }
};
YourForegroundService();
export default function(){console.log("called")}