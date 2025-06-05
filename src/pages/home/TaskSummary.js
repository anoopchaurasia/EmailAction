
import { useEffect, useState } from "react";
import { TouchableHighlight, View } from "react-native";
import { useTheme } from '@react-navigation/native';
import MyText from './../component/MyText';
import ActivityService from './../../realm/ActivityService';
import MessageEvent from "../../event/MessageEvent";

export default function DomainSummary({ navigation }) {
    let colors = useTheme().colors;
    let [taskProcessStatus, setTaskProcessStatus] = useState("");
    let [totalActivity, setTotalActivity] = useState({ total: 0 });



    useEffect(() => {
        fetchTotalActivity();
        let rm2 = MessageEvent.onNativeEvent(MessageEvent.NEW_EMAIL_RULE_CREATED, fetchTotalActivity);
        let rm3 = MessageEvent.onNativeEvent(MessageEvent.EMAIL_RULE_DELETED, fetchTotalActivity);
        return () => { rm2(); rm3(); };
    }, []);

    function fetchTotalActivity() {
        ActivityService.getAll().then(activities => {
            console.log("Total activities: ", activities.length);
            setTotalActivity(prev => ({ ...prev, total: activities.length }));
        });
    }

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
        <TouchableHighlight underlayColor={colors.underlayColor} onPress={x => navigation.navigate("ActivityView")}>
            <View style={{ width: "90%", borderColor: colors.border, borderWidth: 1, margin: 10, marginLeft: "5%" }}>
                <MyText style={{ fontSize: 30, textAlign: "center", color: colors.text }}>
                    Total Rules
                </MyText>
                <MyText style={{ fontSize: 40, textAlign: "center", color: colors.text }}>
                    {totalActivity.total}
                </MyText>
                <MyText style={{ color: colors.text }}>
                    {taskProcessStatus}
                </MyText>
            </View>
        </TouchableHighlight>

    );

}

