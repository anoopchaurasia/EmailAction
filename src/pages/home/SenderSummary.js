import { useEffect, useState } from "react";
import {Text, View, TouchableHighlight } from "react-native";
import MessageAggregateService from './../../realm/EmailAggregateService';
import MessageEvent from "../../event/MessageEvent";

export default function SenderSummary({navigation}) {
    let [fetchCount, setFetchCount] = useState(0);
    const [count, setCount]=useState(-1);
    useEffect(x => {
        setCount(MessageAggregateService.count());
    }, [fetchCount]);

    useEffect(x=> {
        MessageEvent.on('new_message_received', x=> setFetchCount(x=> x+1))
    },[]);

    return (
        <TouchableHighlight onPress={x => navigation.navigate("Sender")}>
            <View style={{ width: "90%", borderColor: "#ddd", borderWidth: 1, margin: 10 }}>
                    <Text style={{ fontSize: 30, textAlign: "center" }}>
                        Total Senders
                    </Text>
                    <Text style={{ fontSize: 40, textAlign: "center" }}>
                        {count}
                    </Text>
                </View>
        </TouchableHighlight>

    );

}

