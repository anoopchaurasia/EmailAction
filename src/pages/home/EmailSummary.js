import React, { useEffect, useState } from "react";
import { Text, View, TouchableHighlight } from "react-native";

import MessageService from "../../realm/EmailMessageService";
import Utility from "../../utility/Utility";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MyText from './../component/MyText'
import { useTheme } from '@react-navigation/native';
import { EventEmitter } from "react-native";
import MessageEvent from "../../event/MessageEvent";

export default function EmailSummary({ navigation }) {

    let [count, setCount] = useState(0);

    let colors = useTheme().colors;
  

    function fetchCount() {
        MessageService.getCount().then(c => {
            setCount(c);
        }).catch(e => {
            console.error("Error fetching email count", e);
        });
    }
    

    useEffect(() => {
        let rm1 = MessageEvent.onNativeEvent(MessageEvent.NEW_MESSAGE_ARRIVED, (message_count) => {
            if (message_count) {
                setCount(count => count + message_count * 1);
            }
        });
        let rm2 = MessageEvent.onNativeEvent(MessageEvent.NEW_MESSAGE_BATCH_ADDED, (batch_number) => {
           fetchCount();
        });
        fetchCount();
        return () => { rm1(); rm2(); };
    }, []);


    return (
        <TouchableHighlight onPress={x => navigation.navigate("EmailListByEmail")}>
            <View>
                <View>
                    <View style={{ width: "90%", borderColor: colors.border, borderWidth: 1, margin: 10, marginLeft: "5%" }}>
                        <MyText style={{ fontSize: 30, textAlign: "center" }}>
                            Total Emails
                        </MyText>
                        <View style={{ position: "absolute", right: 20 }}>

                            {/* {fetchCompleted ?
                                <Icon name="sync" size={25} style={{ marginTop: 10, marginLeft: 0 }} /> :
                                <Icon name="progress-clock" size={25} style={{ marginTop: 10, marginLeft: 0 }} />
                            } */}
                        </View>
                        <MyText style={{ fontSize: 40, textAlign: "center" }}>
                            {count}
                        </MyText>

                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );

}

