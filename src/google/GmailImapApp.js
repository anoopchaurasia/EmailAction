import { NativeModules } from 'react-native';
import Gmail from "./Gmail";
const { EmailModule } = NativeModules;
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import ActivityProcess from './../data/ActivityProcess';


class GmailImapApp {


    static async init() {
        setTimeout(x => {
            GoogleSignin.signInSilently().then(user => {
                GmailImapApp.connectToSocket();
              })
        }, 1000);
    }

    static connectToSocket (){
        Gmail.getAccessToken(false, "GmailImapApp").then(async access_token => {
            let currentUser = await Gmail.getCurrentUser();
            console.log(access_token, "access_token");
            EmailModule.connectToGmail(currentUser?.user?.email, access_token)
                .then((message) => console.log(message, "Connected"))
                .catch((error) => console.error(error, "Error"));

            function WSConnect() {
                const ws = new WebSocket('ws://localhost:8888');

                ws.onopen = () => {
                    console.log('WebSocket connected');
                    setInterval(x => ws.send("I am connected to you"), 10000);
                    ws.send("I am connected to you");
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
                    setTimeout(x => WSConnect(), 2000);
                };
            }
          //  WSConnect();
        }).catch(e=>{
            console.error(e);
            setTimeout(GmailImapApp.connectToSocket, 3000);
        });
    }
}

export default GmailImapApp;