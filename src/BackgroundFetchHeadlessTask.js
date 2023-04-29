// Import the plugin
import BackgroundFetch from "react-native-background-fetch";
import ActivityProcess from './data/ActivityProcess';

// Define a function to handle background fetch events
const onBackgroundFetchEvent = async (taskId) => {
    console.log("[BackgroundFetch] Event received: ", taskId, new Date);
    switch (taskId) {
        case "react-native-background-fetch":
        case "com.email.activity.task":
          await onCustomTask(taskId);
          break;
        default:
          console.log("[BackgroundFetch HeadlessTask] Unknown task id: ", taskId);
          BackgroundFetch.finish(taskId);
          break;
      }    
  };
BackgroundFetch.configure(
    {
      minimumFetchInterval: 5, // The minimum interval in minutes (iOS)
      stopOnTerminate: false, // Set true to cease background-fetch from operating after user "closes" the app (iOS)
      startOnBoot: true, // Set true to automatically start background-fetch whenever the device is rebooted (Android)
      enableHeadless: true, // Set true to enable react-native-background-fetch in headless mode (Android)
      forceAlarmManager: false, // Set true to bypass JobScheduler and use AlarmManager instead (Android)
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Set the required network type for background fetch events (Android)
      requiresCharging: false, // Set true to require device to be plugged in (Android)
      requiresDeviceIdle: false, // Set true to require device to be idle (Android)
      requiresBatteryNotLow: false, // Set true to require battery not be low (Android)
      requiresStorageNotLow: false // Set true to require storage not be low (Android)
    },
    onBackgroundFetchEvent,
    (error) => {
      console.log("[BackgroundFetch] Failed to configure: ", error);
    }
  );


BackgroundFetch.scheduleTask({
    taskId: "com.email.activity.task",
    delay: 0, // The delay in milliseconds before executing the task
    periodic: true, // Set true to repeat this task periodically
    forceAlarmManager: false, // Set true to bypass JobScheduler and use AlarmManager instead (Android)
    stopOnTerminate: false, // Set true to cease background-fetch from operating after user "closes" the app (iOS)
    enableHeadless: true, // Set true to enable react-native-background-fetch in headless mode (Android)
    requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Set the required network type for background fetch events (Android)
    requiresCharging: false, // Set true to require device to be plugged in (Android)
    requiresDeviceIdle: false, // Set true to require device to be idle (Android)
    requiresBatteryNotLow: false, // Set true to require battery not be low (Android)
    requiresStorageNotLow: false // Set true to require storage not be low (Android)
});


// Define a function to handle the custom task
const onCustomTask = async (taskId) => {
  console.log("[BackgroundFetch HeadlessTask] Custom task received: ", taskId, new Date);
  console.log(taskId);
  await ActivityProcess.proessremaining();
  BackgroundFetch.finish(taskId);
};

// Export a function that will dispatch the event to the appropriate handler based on the task id
export default async (event) => {
  switch (event.taskId) {
    case "react-native-background-fetch":
    case "com.email.activity.task":
      await onCustomTask(event.taskId);
      break;
    default:
      console.log("[BackgroundFetch HeadlessTask] Unknown task id: ", event.taskId);
      BackgroundFetch.finish(event.taskId);
      break;
  }
};

