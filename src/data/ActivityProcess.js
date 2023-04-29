import ActivityService from './../realm/Activity';
import ChangeLabel from '../google/changeLabel';
import MessageService from '../realm/EmailMessage';
import DataSync from './DataSync';
let Activity = {
    proessremaining: async function() {
        let pendingTasks = await ActivityService.getNoCompleted();
        Activity.sync();
        for(let i=0; i< pendingTasks.length; i++) {
            let task = pendingTasks[i];
            switch(task.to_label) {
                case 'trash': {
                    Activity.trash(task);
                    await ActivityService.updateObjectById(task.id, {completed: true});
                }
            }
        }
        if(pendingTasks.length==0) console.log("nothing pending");
    },

    sync: async function(pageToken = undefined) {
        await DataSync.getList(undefined, undefined, false, (c, t_c)=> console.log(c, t_c));
    },

    trash: async function(task){
        await ChangeLabel.trash(task.message_ids, function (result) {
            (result || []).forEach(x => MessageService.update(x));
        });
    }
};

export default Activity;