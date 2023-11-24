import { useEffect, useState } from "react";
import { Button, FlatList, Text, View, NativeEventEmitter } from "react-native";


import MessageEvent from './../../event/MessageEvent'
import ActivityService from '../../realm/ActivityService'
import DomainSummary from "./DomainSummary";
import SenderSummary from "./SenderSummary";
import EmailSummary from './EmailSummary';

export default function Home() {



    let [taskProcessStatus, setTaskProcessStatus] = useState("");
    let [totalActivity, setTotalActivity] = useState({ total: 0, pending: 0 });


    useEffect(x=>{
        setTotalActivity({ total: ActivityService.getAll().length, pending: ActivityService.getNoCompleted().length })
    },[])

    function handleEvent(e) {
        switch (e.status) {
            case 'starting': {
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
        return //MessageEvent.on('taskinprogress', handleEvent);
    }, []);
    return (
        <View>
            <DomainSummary />
            <SenderSummary />
            <EmailSummary />
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

        </View>
    )
}