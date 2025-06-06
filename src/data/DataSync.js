import Gmail from '../google/Gmail';
 import Utility from './../utility/Utility';
 export default class MyComponent {

    /// Fetch message IDs based on a query and pagination token for Query feature later move it to Java
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
            console.error("failed: did not receive message", e);
            await Utility.sleep(10000);
            return MyComponent.fetchMessages(query, nextPageToken);
        }
    };

 

    static loadAttachment = async (message_id, attachmentId) => {
        return await Gmail.fetchAttachment(message_id, attachmentId);

    }
 

    static fetchData = async (messageIds) => {
        const batchRequests = await Gmail.createBatchRequest(messageIds, '');
        const result = await Gmail.callBatch(batchRequests);
        console.log(batchRequests, result, "----------------------------------------batchRequests, result");
        return await Gmail.formatBody(result);
    }
 

    static createLabel = async (name) => {
        return await Gmail.createLabel(name);
    }
    ///Load message by id from Gmail API
    static getMessagebById = async (message_id) => {
        return await Gmail.getMessagebById(message_id);
    }


    // Add your code to retrieve the message list here
};
//////     health inssurance 


