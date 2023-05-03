import DataSync from './DataSync';
import AggregateData from './AggregateData';
import ProcessRules from './ProcessRules';


let in_progress = false;
export default Activity = {
    processNew: async function () {
        try {
            if (in_progress) return console.log("in progress return");
            in_progress = true;
            await DataSync.getLabels(true);
            await ProcessRules.process();
            console.log("starting resume sync")
            await DataSync.resumeSync(Activity.newMessages);
            console.log("starting  sync")
            await Activity.sync();
            console.log("completed the process");
            in_progress = false;
        } catch(e) {
            console.error(e);
        }
         finally {
        }
    },

    sync: async function () {
        do {
            var { messages, nextPageToken } = await DataSync.getList({ full_sync: false });
            await Activity.newMessages(messages);
        } while (nextPageToken);
    },

    newMessages: async function (messages) {
        await ProcessRules.takeAction(messages);
        await AggregateData.aggregate(messages);
    },
};
