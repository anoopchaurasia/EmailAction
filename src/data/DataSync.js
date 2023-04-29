import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Gmail from './../google/gmail';
import Label from './../realm/Label';
import MessageService from './../realm/EmailMessage';
import Utility from './../utility/Utility';
export default class MyComponent {

    static fetchMessages = async (query, nextPageToken) => {
        try {
            await GoogleSignin.signInSilently();
            let accessToken = await GoogleSignin.getTokens();
            let { message_ids, nextPageToken: pageToken } = await Gmail.getMessageIds(accessToken.accessToken, query, nextPageToken).catch(e => {
                console.log("failed: did not receive message", e);
                return setTimeout(x => MyComponent.fetchMessages(query, nextPageToken), 10000);
            });
            if (!message_ids) return;
            if (message_ids.length === 0 && !pageToken) return console.log("no result")
            return { message_ids, nextPageToken: pageToken };
        } catch (e) {
            console.error(e, "error");
        }
    };


    static getList = async (query, pageToken = null, full_sync=false, cb) => {
        try {
            if (pageToken == 'done') return console.info("Done getList");
            let { message_ids, nextPageToken } = await MyComponent.fetchMessages(query, pageToken);
            let length = message_ids.length;
            message_ids = message_ids.filter(message_id => MessageService.checkMessageId(message_id) == false);
            if(full_sync === false && length!==message_ids.length) nextPageToken= undefined;
            cb && cb(length, message_ids.length);
            await Utility.saveData("nextPageToken_list", nextPageToken);
            if (message_ids.length) {
                let messages = await MyComponent.fetchMessageMeta(message_ids);
                messages.map(x => MessageService.update(x));
            }
        } catch (e) {
            console.error(e, "get list");
        } finally {
            setTimeout(async x => {
                let nextPageToken = await Utility.getData('nextPageToken_list');
                nextPageToken && nextPageToken != 'done' && MyComponent.getList(query, nextPageToken, full_sync);
            }, 500);
        }
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
        await GoogleSignin.signInSilently();
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

    // Add your code to retrieve the message list here
};
//////     health inssurance 


