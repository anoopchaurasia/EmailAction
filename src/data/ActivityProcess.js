import ActivityService from './../realm/Activity';
import ChangeLabel from '../google/changeLabel';
import MessageService from '../realm/EmailMessage';
import DataSync from './DataSync';
let Activity = {
    proessremaining: async function() {
        let pendingTasks = await ActivityService.getNoCompleted();
        await Activity.sync();
       for(let i=0; i< pendingTasks.length; i++) {
           let task = pendingTasks[i].toJSON();
           if(task.to.includes('trash')) {
                await Activity.trash(task);
                await ActivityService.updateObjectById(task.id, {completed: true});
            }
        }
        if(pendingTasks.length==0) console.log("nothing pending");
    },

    sync: async function(pageToken = undefined) {
        return await DataSync.getList(undefined, undefined, false, (c, t_c)=> console.log(c, t_c));
    },

    trash: async function(task, pageToken){
        let str = setValue('from', task.from.join(","));
        console.log(str);
        let {message_ids, nextPageToken}= await DataSync.fetchMessages(str, pageToken);
        console.log(message_ids, nextPageToken);
        await ChangeLabel.trash(message_ids, function (result) {
            (result || []).forEach(x => MessageService.update(x));
        });
        console.log(message_ids, nextPageToken, "message_ids, nextPageToken");
        nextPageToken && Activity.sync(task, nextPageToken);
    }
};


function setValue(key, value, raw_value) {
    if(value==undefined || value=='') return "";
    if(raw_value) {
        return `${key}:${value}`
    }
    return `${key}:(${value})`;
  }

export default Activity;