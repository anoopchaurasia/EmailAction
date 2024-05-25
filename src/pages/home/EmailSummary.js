import React, { useEffect, useState } from "react";
import { Text, View, TouchableHighlight } from "react-native";

import ActivityProcess from './../../data/ActivityProcess'
import * as Progress from 'react-native-progress';
import MessageService from "../../realm/EmailMessageService";
import Utility from "../../utility/Utility";
import MessageEvent from "../../event/MessageEvent";

import DataSync from './../../data/DataSync'
import MyText from './../component/MyText'
import { useTheme } from '@react-navigation/native';

export default function EmailSummary({ navigation }) {

    let [count, setCount] = useState(MessageService.readAll().length || 0);
    let [inboxInfo, setInboxInfo] = useState({});
    let [processRunningStatus, setProcessRunningStatus] = useState({});

    let colors = useTheme().colors;


    let [prgressPer, setProgressPer] = useState(0);
    let [fetchCompleted, setFetchCompleted] = useState(false);
    let [fetchCompleted1, setFetchCompleted1] = useState(false);

    Utility.getData("sync_completed").then(data => {
        if (data == 'yes') setFetchCompleted(true);
    })

    Utility.getData('full_sync_token').then(data => {
        if (data == 'done') setFetchCompleted1(true);
    })

    useEffect(x => {
        
        DataSync.getTotalEmails().then(data => {
            setInboxInfo(data);
            count && data.messagesTotal && setProgressPer(count / data.messagesTotal);
            //ActivityProcess.processNew();
        }).catch(x => {
            console.log("GetTotal failed", x)
            //ActivityProcess.processNew();
        });

        MessageEvent.on('new_message_received', (messages) => {
            setCount(t => t + messages.length);
            setProgressPer(count / inboxInfo.messagesTotal);
            
        })

        async function latestRun() {
            let ProcessAlreadyInProgress = Math.ceil((new Date().getTime() - new Date(await Utility.getData('ProcessAlreadyInProgress')).getTime()) / 1000 / 60) + " Mins";
            let ProcessEnded = Math.ceil((new Date().getTime() - new Date(await Utility.getData('ProcessEnded')).getTime()) / 1000 / 60) + " Mins";
            let ProcessStarted = Math.ceil((new Date().getTime() - new Date(await Utility.getData('ProcessStarted')).getTime()) / 1000 / 60) + " Mins";
            setProcessRunningStatus({ ProcessAlreadyInProgress, ProcessEnded, ProcessStarted });

        }

        //setInterval(latestRun, 5*60*1000);
        // latestRun();
    }, []);
    function clean() {
        MessageService.deleteAll();
        Utility.deleteData('sync_completed');
        Utility.deleteData('full_sync_token');
    }



    return (
        <TouchableHighlight onPress={x => navigation.navigate("Email")}>
            <View>
                <View>
                    {/* <Progress.Bar progress={prgressPer} width={400} height={20} /> */}
                    <View style={{ width: "90%", borderColor: colors.border, borderWidth: 1, margin: 10, marginLeft: "5%" }}>
                        <MyText style={{ fontSize: 30, textAlign: "center" }}>
                            Total Emails
                        </MyText>
                        <MyText style={{ fontSize: 40, textAlign: "center" }}>
                            {count}/{inboxInfo.messagesTotal}
                        </MyText>
                        <MyText> {fetchCompleted ? "" : "Fetch: InProgress"}</MyText>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );

}

