import { useEffect, useState } from "react";
import {Text, View, TouchableHighlight } from "react-native";
import MessageAggregateService from './../../realm/EmailAggregateService';
import MessageEvent from "../../event/MessageEvent";
import MyText from './../component/MyText'
import { useTheme } from '@react-navigation/native';


export default function SenderSummary({navigation}) {
    let [fetchCount, setFetchCount] = useState(0);
    let colors = useTheme().colors;
    const [count, setCount]=useState(-1);
    useEffect(x => {
        MessageAggregateService.count().then(c => {
            setCount(c);
        });
    }, [fetchCount]);

    useEffect(x=> {
        MessageEvent.on('new_message_received', x=> setFetchCount(x=> x+1))
    },[]);

    return (
        <TouchableHighlight underlayColor={colors.underlayColor} onPress={x => navigation.navigate("Sender")}>
            <View style={{ width: "90%", borderColor: colors.border, borderWidth: 1, margin: 10, marginLeft:"5%"}}>
                    <MyText style={{ fontSize: 30, textAlign: "center" }}>
                        Total Senders
                    </MyText>
                    <MyText style={{ fontSize: 40, textAlign: "center" }}>
                        {count}
                    </MyText>
                </View>
        </TouchableHighlight>

    );

}

