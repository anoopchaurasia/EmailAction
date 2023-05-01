import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Gmail from './../google/gmail';
import Label from '../realm/LabelService';
import MessageService from '../realm/EmailMessageService';
import Utility from './../utility/Utility';
export default class MyComponent {

    static fetchMessages = async (query, nextPageToken) => {
        try {
            if (!GoogleSignin.isSignedIn()) {
                await GoogleSignin.signInSilently();
            }
            let accessToken = await GoogleSignin.getTokens();
            let { message_ids, nextPageToken: pageToken } = await Gmail.getMessageIds(accessToken.accessToken, query, nextPageToken)
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

    static resumeSync = async function (aggregate, streamData) {
        if ((await Utility.getData('sync_completed')) == "yes") return console.log("sync completed");
        do {
            var { nextPageToken, messages } = await MyComponent.getList({ query:"-in:chats", pageToken: await Utility.getData('full_sync_token'), full_sync: true }, streamData || ((c, cc) => console.log(c, cc)));
            aggregate(messages);
            await Utility.saveData('full_sync_token', nextPageToken);
            await Utility.sleep(500);
        } while (nextPageToken);
        await Utility.saveData('sync_completed', 'yes');
    }

    static getList = async ({ query, pageToken = null, full_sync = false }, cb) => {
        if (pageToken == 'done') {
            console.info("Done getList");
            return {};
        }
        let { message_ids, nextPageToken } = await MyComponent.fetchMessages(query, pageToken);
        let length = message_ids.length;
        message_ids = message_ids.filter(message_id => MessageService.checkMessageId(message_id) == false);
        if (full_sync === false && length !== message_ids.length) nextPageToken = undefined;
        console.log(length, message_ids.length, full_sync);
        var messages = [];
        if (message_ids.length) {
            messages = await MyComponent.fetchMessageMeta(message_ids);
            messages.map(x => MessageService.update(x));
        }
        cb && await cb(length, message_ids.length, messages);
        return { nextPageToken, messages };
    };

    static loadAttachment = async (message_id, attachmentId) => {
        let accessToken = await GoogleSignin.getTokens();
        return await Gmail.fetchAttachment(message_id, attachmentId, accessToken.accessToken);

    }

    static fetchMessageMeta = async (messageIds) => {
        const accessToken = (await GoogleSignin.getTokens()).accessToken;
        let params = '?format=metadata&metadataHeaders=Subject&metadataHeaders=from&metadataHeaders=to&metadataHeaders=date&metadataHeaders=lebelIds&metadataHeaders=snippet'
        const batchRequests = await Gmail.createBatchRequest(messageIds, params);
        const result = await Gmail.callBatch(batchRequests, accessToken);
        return await Gmail.format(result);
    }

    static fetchData = async (messageIds) => {
        if (!GoogleSignin.isSignedIn()) {
            await GoogleSignin.signInSilently();
        }
        const accessToken = (await GoogleSignin.getTokens()).accessToken;
        const batchRequests = await Gmail.createBatchRequest(messageIds, '');
        const result = await Gmail.callBatch(batchRequests, accessToken);
        return await Gmail.formatBody(result);
    }

    static getLabels = async () => {
        const accessToken = (await GoogleSignin.getTokens()).accessToken;
        let labels = await Gmail.getLabels(accessToken);
        console.log(labels.length, "Labels length", Label.create)
        labels.forEach(l => { Label.create(l) });
    }

    static getTotalEmails = async () => {
        if (!GoogleSignin.isSignedIn()) {
            await GoogleSignin.signInSilently();
        }
        const accessToken = (await GoogleSignin.getTokens()).accessToken;
        return Gmail.getTotal(accessToken);
    }

    // Add your code to retrieve the message list here
};
//////     health inssurance 


