import Gmail from '../google/Gmail';
import Label from '../realm/LabelService';
import MessageService from '../realm/EmailMessageService';
import Utility from './../utility/Utility';
import MessageEvent from './../event/MessageEvent';
export default class MyComponent {

    static fetchMessages = async (query, nextPageToken) => {
        try {
            console.log(query, nextPageToken, "query, nextPageToken");
            let { message_ids, nextPageToken: pageToken } = await Gmail.getMessageIds(query, nextPageToken)
            if (message_ids.length === 0 && !pageToken) {
                console.log("no result")
                return { message_ids: [], nextPageToken: undefined };
            }
            return { message_ids, nextPageToken: pageToken };
        } catch (e) {
            console.log("failed: did not receive message", e);
            await Utility.sleep(10000);
            return MyComponent.fetchMessages(query, nextPageToken);
        }
    };

    static resumeSync = async function (aggregate) {
        console.log("SYNC in progress Wait -------------------------------------------------------------------------------")
        if ((await Utility.getData('sync_completed')) == "yes") return console.log("sync completed");
        do {
            var { nextPageToken, messages } = await MyComponent
                .getList({ query:"-in:chats", pageToken: await Utility.getData('full_sync_token'), full_sync: true }).catch(e=>console.error(e, "resume sync issue"));
            aggregate(messages);
            await Utility.saveData('full_sync_token', nextPageToken);
            console.log("completed loop", nextPageToken);
            
            MessageEvent.emit('new_message_received', messages);
            await Utility.sleep(500);
        } while (nextPageToken);
        await Utility.saveData('sync_completed', 'yes');
    }

    static getList = async ({ query, pageToken = null, full_sync = false }) => {
        if (pageToken == 'done') {
            console.info("Done getList");
            return {};
        }
        let { message_ids, nextPageToken } = await MyComponent.fetchMessages(query, pageToken);
        let length = message_ids.length;
        message_ids = message_ids.filter(message_id => MessageService.checkMessageId(message_id) == false);
        if (full_sync === false && length !== message_ids.length) nextPageToken = undefined;
        var messages = [];
        if (message_ids.length) {
            messages = await MyComponent.fetchMessageMeta(message_ids);
            console.log(messages[0]);
            messages.map(x => {try {MessageService.update(x)} catch(e){console.error(e, "update failed getList", x)} });
        }
        return { nextPageToken, messages };
    };

    static loadAttachment = async (message_id, attachmentId) => {
        return await Gmail.fetchAttachment(message_id, attachmentId);

    }

    static fetchMessageMeta = async (messageIds) => {
        let params = '?format=metadata&metadataHeaders=Subject&metadataHeaders=from&metadataHeaders=to&metadataHeaders=date&metadataHeaders=lebelIds&metadataHeaders=snippet'
        const batchRequests = await Gmail.createBatchRequest(messageIds, params);
        const result = await Gmail.callBatch(batchRequests);
        return await Gmail.format(result);
    }

    static fetchData = async (messageIds) => {
        const batchRequests = await Gmail.createBatchRequest(messageIds, '');
        const result = await Gmail.callBatch(batchRequests);
        return await Gmail.formatBody(result);
    }

    static getLabels = async (fresh_sync=false) => {
        console.log(await Utility.getData('label_loaded'), "labels are loded")
        if((await Utility.getData('label_loaded')) == 'yes' && fresh_sync==false) return;
        Label.deleteAll();
        console.log("label loading in progress");
        let labels = await Gmail.getLabels();
        labels.forEach(l => { Label.create(l) });
        Utility.saveData('label_loaded', 'yes');
    }

    static getTotalEmails = async () => {
        return Gmail.getTotal();
    }

    static createLabel = async(name)=>{
        return await Gmail.createLabel(name);
    }

    static moveToFolder = async() => {
        requestBody = {
            addLabelIds: [ORDER_LABEL_ID], // Add the order label ID
            removeLabelIds: ['INBOX'], // Remove the inbox label ID
        };
    }

    static getMessagebById = async (message_id) => {
        return await Gmail.getMessagebById(message_id);
    }


    // Add your code to retrieve the message list here
};
//////     health inssurance 


