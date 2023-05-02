
import ActivityService from './../realm/ActivityService';
import ChangeLabel from './../google/Label';

export default ProcessRules = {

    process: async () => {
        let pendingTasks = await ActivityService.getNoCompleted().toJSON();
        for (let i = 0, len = pendingTasks.length; i < len; i++) {
            let task = pendingTasks[i];
            if (task.from.length < 1) {
                console.error("filter is not present, it should contain atleast one sender email")
                break;
            }
            console.log('moving', task.from_label, task.to_label, task.from);
            if (task.action === 'trash') {
                await ProcessRules.trash(task);
                await ActivityService.updateObjectById(task.id, { completed: true });
            } else if (task.action=="move") {
                await ProcessRules.moveToFolder(task);
                await ActivityService.updateObjectById(task.id, { completed: true });
            } else if (task.action=="copy") {
                await ProcessRules.copyToFolder(task);
                await ActivityService.updateObjectById(task.id, { completed: true });
            }  else {
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
        if(message_ids && message_ids.length) return await process(message_ids);
        let c = 0;
        do {
            let str = setValue('from', task.from.join(",")) + setValue(" in", 'inbox', true);
            var { message_ids, nextPageToken } = await DataSync.fetchMessages(str, pageToken).catch(e => console.error(e, "Folder change ActiveProcess", task));
            c += message_ids.length;
            await process(message_ids, c);
        } while (nextPageToken);

    },

    moveToFolder: async function (task, message_ids) {
        try {
            await this.getMessageIds(task, async (message_ids) => {
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
        for(let i=0; i<messages.length; i++) {
            let {task, message_id} = matchQuery(fromlist, messages[i]);
            if(!task) continue;
            if (task.action === 'trash') {
                await ProcessRules.trash(task, [message_id]);
            } else if (task.action=="move") {
                await ProcessRules.moveToFolder(task, [message_id]);
            } else if(task.action=="copy") { ////copy if we are not removing existing labels
                await ProcessRules.copyToFolder(task, [message_id]);
            }
        }
    },
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
