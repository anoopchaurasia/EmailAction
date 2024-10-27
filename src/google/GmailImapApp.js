import { NativeModules } from 'react-native';
import Gmail from "./Gmail"; 
const { EmailModule } = NativeModules;




class GmailImapApp {


    static async init() {

        let access_token = await Gmail.getAccessToken();

        console.log(access_token, "access_token");
        setTimeout(x=>{

            EmailModule.connectToGmail('anoop.iitbhu@gmail.com', access_token)
                .then((message) => console.log(message))
                .catch((error) => console.error(error));

                const socket = new WebSocket('ws://localhost:8080');

                socket.addEventListener('open', (event) => {
                    console.log('Connected to WebSocket server');
                });

                socket.addEventListener('message', (event) => {
                    console.log('New email subject:', event.data);
                });
        }, 1000)

          console.log("testing ------------------------- --- -- ")

        ;
    }
}

export default GmailImapApp;