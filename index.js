/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import BackgroundFetch from "react-native-background-fetch";
import {name as appName} from './app.json';
//import Event from './src/Event'

AppRegistry.registerComponent(appName, () => App);

import BackgroundFetchHeadlessTask from "./src/BackgroundFetchHeadlessTask";
BackgroundFetch.registerHeadlessTask(BackgroundFetchHeadlessTask);

