import DataSync from './DataSync';
import AggregateData from './AggregateData';
import ProcessRules from './ProcessRules';
import Utility from '../utility/Utility';


let in_progress = false;
export default Activity = {
    processNew: async function () {
        try {
            let date = new Date();
            in_progress && Utility.saveData("ProcessAlreadyInProgress", date.toISOString());
            if (in_progress) return console.log("in progress return");
            console.log("Process New ===================================================================")
            Utility.saveData("ProcessStarted", date.toISOString());
            in_progress = true;
            await DataSync.getLabels(true);
            console.log("1. starting resume sync", ) // dont change the sequence  first one should be 
            //one time sync then sync left over , then process tasks
            ///other wise tasks may add random message casusing logic to stop sync 
            await DataSync.resumeSync(Activity.newMessages);
            console.log("2. starting  sync")
            await Activity.sync();
            await ProcessRules.process();
            console.log("completed the process");
            in_progress = false;
        } catch(e) {
            console.error(e, "process new failed", e.stack);
        }
         finally {
            let date = new Date();
            in_progress = false;
            Utility.saveData("ProcessEnded", date.toISOString());
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
