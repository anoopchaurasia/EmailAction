import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Gmail from './../google/gmail';
import Label from './../realm/Label';
export default class MyComponent {

    static getList = async (query, nextPageToken) => {
        try {
            await GoogleSignin.signInSilently();
            let accessToken = await GoogleSignin.getTokens();
            let { message_ids, nextPageToken: pageToken } = await Gmail.getMessageIds(accessToken.accessToken, query, nextPageToken).catch(e => {
                console.log("failed: did not receive message", e);
                return setTimeout(x => MyComponent.getList(query, onData, nextPageToken), 10000);
            });
            if (!message_ids) return;
            if (message_ids.length === 0 && !pageToken) return console.log("no result")
            return { message_ids, nextPageToken: pageToken };
        } catch (e) {
            console.error(e, "error");
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

