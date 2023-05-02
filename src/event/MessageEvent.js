import {NativeEventEmitter} from 'react-native';
const eventEmitter = new NativeEventEmitter();

export default class MessageEvent{
    static on = (event_name, handleEvent) => {
        return eventEmitter.addListener(event_name, handleEvent).remove;
    }

    static emit = (event_name, data) => {
        eventEmitter.emit(event_name, data);
    }

};