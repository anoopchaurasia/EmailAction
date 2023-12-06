import {NativeEventEmitter} from 'react-native';
const eventEmitter = new NativeEventEmitter();

const handleEvents = {};
const timeouts = {};
export default class MessageEvent{
    
    static on = (event_name, handleEvent, enable_last=false) => {
        try{

        if(typeof handleEvent != 'function') throw console.error(event_name, " is not a function", handleEvent);
        handleEvents[event_name] = handleEvents[event_name] || [];
        timeouts[event_name] = timeouts[event_name] = null;
        let obj = {fn:handleEvent, enable_last}
        handleEvents[event_name].push(obj);
        return function(){
            let index = handleEvents[event_name].indexOf(obj);
            index != -1 && handleEvents[event_name].splice(index, 1);
            if(handleEvents[event_name].length==0) delete handleEvents[event_name];
        }
        } catch(e) {
            console.error( e);
        }
    }


    static emit = (event_name, data) => {
        if(!handleEvents[event_name]) return;
        
        setTimeout(x=>{
            handleEvents[event_name].forEach(obj=> {
                if(obj.enable_last==false) obj.fn(data);
            })
        }, 0);

        clearTimeout( timeouts[event_name]);
        timeouts[event_name] = setTimeout(x=>{
            handleEvents[event_name].forEach(obj=> {
                if(obj.enable_last==true) obj.fn(data);
            })
        }, 250);
        

    }
};