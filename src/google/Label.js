
import { startAtIndex } from "react-native-paper-dates/lib/typescript/Date/dateUtils";
import Gmail from "./Gmail"

export default class Label {
    static trash = async (message_ids, processCB) =>{
        console.log(message_ids.length, "totals")
        let result =[];
        for(let i=0; i<message_ids.length; i+=30) {
            let send = message_ids.slice(i, i+30);
            let batchRequests = await Gmail.createBatchRequest(send, "/trash", "POST", {});
            result = await Gmail.callBatch(batchRequests)
            result = result.filter(r=> r.body).map(x=>({message_id: x.body.id, labels: x.body.labelIds}));
            result = result.filter(x=>x.message_id);
            processCB(result);
            await pause(1*1000);
        } 
        console.log("completed", result.length);
        return result
    }

    static create = async (name) =>{
        return await Gmail.createLabel(name);
    }

    static moveToFolder = async (task, message_ids, processCB) =>{
        const requestBody = {
            addLabelIds: [task.to_label], // Add the order label ID
            removeLabelIds: [task.from_label], // Remove the inbox label ID
          };
        console.log(message_ids.length, "totals")
        let result =[];
        for(let i=0; i<message_ids.length; i+=30) {
            let send = message_ids.slice(i, i+30);
            let batchRequests = await Gmail.createBatchRequest(send, "/modify", "POST", requestBody);
            result = await Gmail.callBatch(batchRequests)
            result = result.filter(r=> r.body).map(x=>({message_id: x.body.id, labels: x.body.labelIds})).filter(x=>x.message_id);
            processCB(result);
            await pause(1*500);
        } 
        console.log("completed", result.length);
        return result
    };
}


async function pause(timer) {
    return  new Promise((resolve)=>{
        setTimeout(resolve, timer); 
    })
}