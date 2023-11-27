import {NativeEventEmitter} from 'react-native';
const eventEmitter = new NativeEventEmitter();

const handleEvents = {};
export default class MessageEvent{
    
    static on = (event_name, handleEvent) => {
        try{

        if(typeof handleEvent != 'function') throw console.error(event_name, " is not a function", handleEvent);
        handleEvents[event_name] = handleEvents[event_name] || [];
        handleEvents[event_name].push(handleEvent);
        return function(){
            let index = handleEvents[event_name].indexOf(handleEvent);
            console.log(handleEvents, index);
            index != -1 && handleEvent[event_name].splice(index, 1);
            if(handleEvents[event_name].length==0) delete handleEvents[event_name];
        }
        } catch(e) {
            console.error( e);
        }
    }

    static emit = (event_name, data) => {
        if(!handleEvents[event_name]) return;
        
        setTimeout(x=>{
            handleEvents[event_name].forEach(fn=> {
                console.log(handleEvents[event_name], "handleEvents1");
                fn(data);
            })
        }, 0);
    }

};