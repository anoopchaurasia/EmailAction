import { NativeModules } from 'react-native';
import Gmail from "./Gmail"; 
const { EmailModule } = NativeModules;

import ActivityProcess from './../data/ActivityProcess';


class GmailImapApp {


    static async init() {

        let access_token = await Gmail.getAccessToken();
        let currentUser = await Gmail.getCurrentUser();
        console.log(access_token, "access_token");
        setTimeout(x=>{

            EmailModule.connectToGmail(currentUser?.user?.email, access_token)
                .then((message) => console.log(message, "Connected"))
                .catch((error) => console.error(error, "Error"));

                function WSConnect() {
                    const ws = new WebSocket('ws://127.0.0.1:8765');

                    ws.onopen = () => {
                    console.log('WebSocket connected');
                  //  setIsConnected(true);
                    };
                
                    ws.onmessage = (message) => {
                    // Handle incoming messages
                        console.log('Received message:', message.data);
                        ActivityProcess.processNew();
                    };
                
                    ws.onerror = (error) => {
                    console.log('WebSocket error:', error.message);
                    };
                
                    ws.onclose = (e) => {
                        console.log('WebSocket closed:', e.code, e.reason);
                        //setIsConnected(false);
                        setTimeout(x=> WSConnect, 2000);
                    };
                }
                WSConnect();
               
        }, 1000)

          console.log("testing ------------------------- --- -- ")

        ;
    }
}

export default GmailImapApp;