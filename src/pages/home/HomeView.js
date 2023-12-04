import { useEffect, useState } from "react";
import {Text, View, TouchableHighlight } from "react-native";
import { useTheme } from '@react-navigation/native';

import ActivityService from '../../realm/ActivityService'
import DomainSummary from "./DomainSummary";
import SenderSummary from "./SenderSummary";
import EmailSummary from './EmailSummary';
import MyText from './../component/MyText'


export default function Home({navigation}) {

    const colors = useTheme().colors;

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
        <View style={{backgroundColor: colors.background}}>
            <DomainSummary navigation={navigation} />
            <SenderSummary navigation={navigation} />
            <EmailSummary navigation={navigation} />
            <TouchableHighlight onPress={x=> navigation.navigate("ActivityView")}>
                <View style={{ width: "90%", borderColor: colors.colors, borderWidth: 1, margin: 10 }}>
                    <MyText style={{ fontSize: 30, textAlign: "center", color: colors.text  }}>
                        Total Tasks
                    </MyText>
                    <MyText style={{ fontSize: 40, textAlign: "center", color: colors.text  }}>
                        {totalActivity.pending}/{totalActivity.total}
                    </MyText>
                    <MyText style={{color: colors.text }}>
                        {taskProcessStatus}
                    </MyText>
                </View>
            </TouchableHighlight>

        </View>
    )
}