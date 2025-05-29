
import { useEffect, useState } from "react";
import {TouchableHighlight, View } from "react-native";
import { useTheme } from '@react-navigation/native';
import MyText from './../component/MyText';
import ActivityService from './../../realm/ActivityService';

export default function DomainSummary({navigation}) {
   let colors = useTheme().colors;
    let [taskProcessStatus, setTaskProcessStatus] = useState("");
    let [totalActivity, setTotalActivity] = useState({ total: 0, pending: 0 });

    useEffect(x=>{
        ActivityService.getAll().then(activities => {
            console.log("Total activities: ", activities.length);
            setTotalActivity(prev => ({ ...prev, total: activities.length  }));
        });

        ActivityService.getNoCompleted().then(pendingActivities => {
            console.log("Pending activities: ", pendingActivities.length);
            setTotalActivity(prev => ({ ...prev, pending: pendingActivities.length }));
        });
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
        <TouchableHighlight underlayColor={colors.underlayColor}onPress={x=> navigation.navigate("ActivityView")}>
            <View style={{ width: "90%", borderColor: colors.border, borderWidth: 1, margin: 10, marginLeft:"5%" }}>
                <MyText style={{ fontSize: 30, textAlign: "center", color: colors.text  }}>
                    Total Rules
                </MyText>
                <MyText style={{ fontSize: 40, textAlign: "center", color: colors.text  }}>
                    {totalActivity.pending}/{totalActivity.total}
                </MyText>
                <MyText style={{color: colors.text }}>
                    {taskProcessStatus}
                </MyText>
        </View>
        </TouchableHighlight>

    );

}

