
import { startAtIndex } from "react-native-paper-dates/lib/typescript/Date/dateUtils";
import Gmail from "./Gmail"

export default class Label {
    static trash = async (message_ids, processCB) =>{
        let result =[];
        for(let i=0; i<message_ids.length; i+=25) {
            console.log("processing", i, i+25,  "of", message_ids.length);
            let send = message_ids.slice(i, i+25);
            let batchRequests = await Gmail.createBatchRequest(send, "/trash", "POST", {});
            await Label.change(batchRequests, processCB);
        } 
    }

    static create = async (name) =>{
        return await Gmail.createLabel(name);
    }

    static change = async (batchRequests, processCB) => {
        let result = await Gmail.callBatch(batchRequests).catch(e=> console.error(e, "callback"))
        result.filter(r=>r.body && !r.body.id).map(x=> console.log("missed in the process ", x));
        result = result.filter(r=> r.body && r.body.id).map(x=>({message_id: x.body.id, labels: x.body.labelIds}));
        processCB(result);
        await pause(1*1000);
    }


    static moveToFolder = async (task, message_ids, processCB) =>{
        const requestBody = {
            addLabelIds: [task.to_label], // Add the order label ID
            removeLabelIds: [task.from_label], // Remove the inbox label ID
        };
        for(let i=0; i<message_ids.length; i+=25) {
            let send = message_ids.slice(i, i+25);
            let batchRequests = await Gmail.createBatchRequest(send, "/modify", "POST", requestBody);
            await Label.change(batchRequests, processCB);;
        }
    };

    static copyToFolder = async (task, message_ids, processCB) =>{
        const requestBody = {
            addLabelIds: [task.to_label], // Add the order label ID
            removeLabelIds: [], // Remove the inbox label ID
        };
        for(let i=0; i<message_ids.length; i+=25) {
            let send = message_ids.slice(i, i+25);
            let batchRequests = await Gmail.createBatchRequest(send, "/modify", "POST", requestBody);
            await Label.change(batchRequests, processCB);;
        }
    };
}


async function pause(timer) {
    return  new Promise((resolve)=>{
        setTimeout(resolve, timer); 
    })
}