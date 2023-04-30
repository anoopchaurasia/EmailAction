
import Gmail from "./gmail"
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default class Label {
    static trash = async (messages, processCB) =>{
        console.log(messages.length, "totals")
        let result =[];
        for(let i=0; i<messages.length; i+=30) {
            let send = messages.slice(i, i+30);
            let batchRequests = await Gmail.createBatchRequest(send, "/trash", "POST", {});
            const accessToken = (await GoogleSignin.getTokens()).accessToken;
            result = await Gmail.callBatch(batchRequests, accessToken)
            console.log(result, 'result', result.filter(r=> r.body && r.body.error).map(r=>r.body.error));
            result = result.filter(r=> r.body).map(x=>({message_id: x.body.id, labels: x.body.labelIds}));
            result = result.filter(x=>x.message_id);
            processCB(result);
            await pause(1*1000);
        } 
        console.log("completed", result.length);
        return result
    }
}

async function pause(timer) {
    return  new Promise((resolve)=>{
        setTimeout(resolve, timer); 
    })
}