import ActivityService from '../realm/ActivityService';
import ChangeLabel from '../google/changeLabel';
import MessageService from '../realm/EmailMessageService';
import DataSync from './DataSync';
import MessageAggregateService from '../realm/EmailAggregateService';
let Activity = {
    proessremaining: async function(syncCB) {
        let pendingTasks = await ActivityService.getNoCompleted();
        for(let i=0; i< pendingTasks.length; i++) {
            let task = pendingTasks[i].toJSON();
            if(task.to.includes('trash')) {
                await Activity.trash(task);
                await ActivityService.updateObjectById(task.id, {completed: true});
            }
        }
        if(pendingTasks.length==0) console.log("nothing pending");
        await DataSync.resumeSync(Activity.aggregate, syncCB);
       await Activity.sync(await ActivityService.getAll());
    },

    sync: async function(tasks) {
        let fromlist= {};
        tasks.filter(x=>x.from).forEach(x=> x.from.forEach(r=> fromlist[r]=x));
        console.log(Object.keys(fromlist), 'fromlist');
        ///TODO: handle more than 100 new emials as get list only support on time sync
        return await DataSync.getList({full_sync: false}, async (c, t_c, messages)=> {
            console.log(c, t_c);
            let actions = messages.map(message=>{
                return matchQuery(fromlist, message);
            }).filter(x=>x && x.action);
            let trash_message_ids = actions.filter(x=>x.action=="trash").map(x=>x.message_id);
            console.log("trashing following", trash_message_ids);
            await ChangeLabel.trash(trash_message_ids, function (result) {
                (result || []).forEach(x => MessageService.update(x));
            });
            Activity.aggregate(messages);
        });
    },

    aggregate: async function(messages) {
        let countSender = messages.reduce((acc, message) => {
            const sender = message.sender;
            if (!acc[sender]) {
                acc[sender] = {c: 0, labels: {}};
            }
            acc[sender].c++;
            message.labels.forEach(l=>{
                if(!acc[sender].labels[l]) acc[sender].labels[l]=0
                acc[sender].labels[l]++;
                if(l==="TRASH") acc[sender].c--;
            })
            return acc;
        }, {});
        let d = [];
        for(let k in countSender) {
            d.push({count: countSender[k].c, labels: countSender[k].labels, sender: k})
        }
        d.map(sender => {
            let labels = [];
            for (let k in sender.labels) {
                labels.push({
                    count: sender.labels[k],
                    id: k,
                    name: k
                })
            }
            return MessageAggregateService.updateCount({
                ...sender,
                labels: labels
            })
        });
        return d; 
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

function matchQuery(fromlist, message) {
    let temp = fromlist[message.sender];
    if(temp) return {
        message_id: message.message_id,
        action: temp.to.includes('trash') ? 'trash': ''
    }
}


function setValue(key, value, raw_value) {
    if(value==undefined || value=='') return "";
    if(raw_value) {
        return `${key}:${value}`
    }
    return `${key}:(${value})`;
  }

export default Activity;