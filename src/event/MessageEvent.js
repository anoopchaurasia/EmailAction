
import { NativeEventEmitter, NativeModules } from 'react-native';

const { NativeNotifier } = NativeModules;

const handleEvents = {};
const timeouts = {};
export default class MessageEvent {
    static NEW_MESSAGE_ARRIVED = "new_message_arrived";
    static NEW_MESSAGE_BATCH_ADDED = "new_message_batch_added";
    static NEW_EMAIL_RULE_CREATED = "new_email_rule_created";
    static EMAIL_RULE_DELETED = "email_rule_deleted";
    static on = (event_name, handleEvent, enable_last = false) => {
        try {

            if (typeof handleEvent != 'function') throw console.error(event_name, " is not a function", handleEvent);
            handleEvents[event_name] = handleEvents[event_name] || [];
            timeouts[event_name] = timeouts[event_name] = null;
            let obj = { fn: handleEvent, enable_last }
            handleEvents[event_name].push(obj);
            return function () {
                let index = handleEvents[event_name].indexOf(obj);
                index != -1 && handleEvents[event_name].splice(index, 1);
                if (handleEvents[event_name].length == 0) delete handleEvents[event_name];
            }
        } catch (e) {
            console.error(e);
        }
    }


    static emit = (event_name, data) => {
        if (!handleEvents[event_name]) return;

        setTimeout(x => {
            handleEvents[event_name].forEach(obj => {
                if (obj.enable_last == false) obj.fn(data);
            })
        }, 0);

        clearTimeout(timeouts[event_name]);
        timeouts[event_name] = setTimeout(x => {
            handleEvents[event_name].forEach(obj => {
                if (obj.enable_last == true) obj.fn(data);
            })
        }, 250);
    }

    static onNativeEvent(event_name, handleEvent) {
        const eventEmitter = new NativeEventEmitter(NativeNotifier);
        const subscription = eventEmitter.addListener(event_name, handleEvent);
        return () => subscription.remove();
    }
}