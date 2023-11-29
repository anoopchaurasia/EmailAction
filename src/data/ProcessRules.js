
import ActivityService from './../realm/ActivityService';
import ChangeLabel from './../google/Label';
import DataSync from './DataSync';
import MessageService from './../realm/EmailMessageService'

export default ProcessRules = {

    process: async () => {
        let pendingTasks = await ActivityService.getNoCompleted().toJSON();
        for (let i = 0, len = pendingTasks.length; i < len; i++) {
            let task = pendingTasks[i];
            if (task.from.length < 1) {
                console.error("filter is not present, it should contain atleast one sender email")
                break;
            }
            console.log(task.action, task.from_label, task.to_label, task.from);
            if (task.action === 'trash') {
                await ProcessRules.trash(task);
                 await ActivityService.updateObjectById(task.id, { completed: true });
            } else if (task.action == "move") {
                await ProcessRules.moveToFolder(task);
                  await ActivityService.updateObjectById(task.id, { completed: true });
            } else if (task.action == "copy") {
                await ProcessRules.copyToFolder(task);
                await ActivityService.updateObjectById(task.id, { completed: true });
            } else {
                console.log("no action defined", task);
            }
        }
    },
    trash: async function (task, message_ids) {
        try {
            await this.getMessageIds(task, async (message_ids) => {
                await ChangeLabel.trash(message_ids, function (result) {
                    (result || []).forEach(x => MessageService.update(x));
                }).catch(e => console.error(e, "Trash ActiveProcess", task));
            }, message_ids)
        } catch (e) {
            console.log(e, "Trash")
        }
    },

    getMessageIds: async function (task, process, message_ids) {
        if (message_ids && message_ids.length) return await process(message_ids);
        let c = 0, i=0;
        while(i<task.from.length){
            let from = task.from[i];
            var nextPageToken=undefined;
            do {
                try {
                    let str = setValue('from', from) + setValue(" in", 'inbox', true);
                    var { message_ids, nextPageToken } = await DataSync.fetchMessages(str, nextPageToken).catch(e => console.error(e, "Folder change ActiveProcess", task));
                    c += message_ids.length;
                    await process(message_ids, c);
                } catch (e) {
                    console.error(e, "get Message Ids");
                }
            } while (nextPageToken);
            i++;
        }
    },

    moveToFolder: async function (task, message_ids) {
        try {
            await this.getMessageIds(task, async (message_ids) => {
                console.log(message_ids);
                await ChangeLabel.moveToFolder(task, message_ids, function (result) {
                    (result || []).forEach(x => MessageService.update(x));
                }).catch(e => console.error(e, "Folder change", task));
            }, message_ids);
        } catch (e) {
        }
    },
    copyToFolder: async function (task, message_ids) {
        try {
            await this.getMessageIds(task, async (message_ids) => {
                await ChangeLabel.copyToFolder(task, message_ids, function (result) {
                    (result || []).forEach(x => MessageService.update(x));
                }).catch(e => console.error(e, "copy change", task));
            }, message_ids);
        } catch (e) {
        }
    },
    takeAction: async function (messages) {

        let fromlist = {};
        ActivityService.getAll().filter(x => x.from).forEach(x => x.from.forEach(r => fromlist[r] = x));
        for (let i = 0; i < messages.length; i++) {
            let { task, message_id } = matchQuery(fromlist, messages[i]);
            if (!task) continue;
            if (task.action === 'trash') {
                await ProcessRules.trash(task, [message_id]);
            } else if (task.action == "move") {
                await ProcessRules.moveToFolder(task, [message_id]);
            } else if (task.action == "copy") { ////copy if we are not removing existing labels
                await ProcessRules.copyToFolder(task, [message_id]);
            }
        }
    },
    createNewRule: async function (label, senders, action, type) {
        console.log(senders, label, action  , "createNewRule");
        if(!action || !senders || !label || !type) throw "no action or senders or label provide";
       // if(ActivityService.getBySender(senders)) throw "rule already exist";
        ActivityService.createObject({
            to_label: label.to_label,
            from: senders,
            created_at: new Date,
            action: action,
            completed: false,
            type: type
        });
    }
};


function matchQuery(fromlist, message) {
    let temp = fromlist[message.sender];
    if (temp) return {
        message_id: message.message_id,
        task: temp
    }
    return {};
}


function setValue(key, value, raw_value) {
    if (value == undefined || value == '') return "";
    if (raw_value) {
        return `${key}:${value}`
    }
    return `${key}:(${value})`;
}
