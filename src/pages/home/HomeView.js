import { useEffect, useState } from "react";
import { Button, FlatList, Text, View, NativeEventEmitter } from "react-native";
import DataSync from './../../data/DataSync'
import ActivityProcess from './../../data/ActivityProcess'
import * as Progress from 'react-native-progress';
import MessageService from "../../realm/EmailMessageService";
import Utility from "../../utility/Utility";
import ActivityService from '../../realm/ActivityService'
import MessageEvent from './../../event/MessageEvent'

export default function Home() {
    let [inboxInfo, setInboxInfo] = useState({});
    let [count, setCount] = useState(MessageService.readAll().length || 0);
    let [totalActivity, setTotalActivity] = useState({ total: 0, pending: 0 });
    let [prgressPer, setProgressPer] = useState(0);
    let [fetchCompleted, setFetchCompleted] = useState(false);
    let [fetchCompleted1, setFetchCompleted1] = useState(false);
    let [taskProcessStatus, setTaskProcessStatus] = useState("");
    let [processRunningStatus, setProcessRunningStatus] = useState({});


    useEffect(x => {
        DataSync.getTotalEmails().then(data => {
            console.log(data);
            setInboxInfo(data);
            count && data.messagesTotal && setProgressPer(count / data.messagesTotal);
            let fetchedCount = count;
            console.log(ActivityProcess, ActivityProcess.processNew, "ActivityProcess, ActivityProcess.processNew");
            ActivityProcess.processNew((c, cc) => {
                setCount(t => t + c);
                fetchedCount += c;
                console.log(fetchedCount, data.messagesTotal, "data.messagesTotal");
                setProgressPer(fetchedCount / data.messagesTotal);

            });
        }).catch(x => {
            console.log("GetTotal failed", x)
            ActivityProcess.processNew((c, cc) => {
                setCount(t => t + c);
            });
        });

        async function latestRun() {
                let ProcessAlreadyInProgress = Math.ceil((new Date().getTime() -  new Date(await Utility.getData('ProcessAlreadyInProgress')).getTime())/1000/60) + " Mins";
                let ProcessEnded =   Math.ceil((new Date().getTime() - new Date(await Utility.getData('ProcessEnded')).getTime())/1000/60) + " Mins";
                let ProcessStarted  =   Math.ceil((new Date().getTime() - new Date(await Utility.getData('ProcessStarted')).getTime())/1000/60) + " Mins";
                setProcessRunningStatus({ ProcessAlreadyInProgress, ProcessEnded, ProcessStarted});
            
        }

        setInterval(latestRun, 5*60*1000);
        latestRun();
        

        setTotalActivity({ total: ActivityService.getAll().length, pending: ActivityService.getNoCompleted().length })
    }, []);
    Utility.getData("sync_completed").then(data => {
        if (data == 'yes') setFetchCompleted(true);
    })

    Utility.getData('full_sync_token').then(data => {
        if (data == 'done') setFetchCompleted1(true);
    })

    function clean() {
        MessageService.deleteAll();
        Utility.deleteData('sync_completed');
        Utility.deleteData('full_sync_token');
    }

function handleEvent(e) {
    switch(e.status) {
        case 'starting':{
            setTaskProcessStatus(`Started processing task for sender ${e.task.from.toString()} moving to ${e.task.to_label}`);
            break;
        }
        case 'processing': {
            setTaskProcessStatus(`Started processing task for sender ${e.task.from.toString()} moving to ${e.task.to_label}: ${e.count}`);
            break;
        }
        case 'processed': {
            setTaskProcessStatus(`Started processing task for sender ${e.task.from.toString()} moving to ${e.task.to_label}: ${e.count}`);
            break;
        }
    }
}

    // Use useEffect to add and remove the listener
    useEffect(() => {
        return MessageEvent.on('taskinprogress', handleEvent);
    }, []);
    return (
        <View>
            <View>
                <Progress.Bar progress={prgressPer} width={400} height={20} />
                <View style={{ width: "90%", borderColor: "#ddd", borderWidth: 1, margin: 10 }}>
                    <Text style={{ fontSize: 30, textAlign: "center" }}>
                        Total
                    </Text>
                    <Text style={{ fontSize: 40, textAlign: "center" }}>
                        {count}/{inboxInfo.messagesTotal}
                    </Text>
                    <Text>Fetch: {fetchCompleted ? "Completed" : "InProgress"} {fetchCompleted1 ? "done" : "in prgress"}</Text>
                </View>
            </View>
            <View>
                <View style={{ width: "90%", borderColor: "#ddd", borderWidth: 1, margin: 10 }}>
                    <Text style={{ fontSize: 30, textAlign: "center" }}>
                        Total Tasks
                    </Text>
                    <Text style={{ fontSize: 40, textAlign: "center" }}>
                        {totalActivity.pending}/{totalActivity.total}
                    </Text>
                    <Text>
                        {taskProcessStatus}
                    </Text>
                </View>
            </View>
            <View>
                <Text>
                    {JSON.stringify(processRunningStatus, null, 2)}
                </Text>
            </View>
        </View>
    )
}