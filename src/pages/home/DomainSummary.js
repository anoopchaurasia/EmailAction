import { useEffect, useState } from "react";
import {Text, TouchableHighlight, View } from "react-native";
import MessageAggregateService from './../../realm/EmailAggregateService';
import MessageEvent from "../../event/MessageEvent";
import { useTheme } from '@react-navigation/native';
import MyText from './../component/MyText';


export default function DomainSummary({navigation}) {
    const [count, setCount]=useState(-1);
    let [fetchCount, setFetchCount] = useState(0);
    const colors = useTheme().colors;

    useEffect(x => {
        let list = MessageAggregateService.readAll();
        let domains = {};
        list.forEach(x => {
            let domain = x.sender_domain;
            if (!domains[domain]) {
                domains[domain] = {c:0, sender_name: x.sender_name};
            }
            domains[domain].c += x.count;
        });
        list = Object.keys(domains).map(x => {
            return {
                sender: x,
                sender_name: domains[x].sender_name,
                count: domains[x].c
            }
        });
        setCount(list.length);
    }, [fetchCount]);
    useEffect(x=> {
       let rm1 =  MessageEvent.on('new_message_received', x=>setFetchCount(x=> x+1));
        return x=> {rm1();};
    },[]);

    return (
        <TouchableHighlight onPress={x=> navigation.navigate("Domain")}>
            <View style={{ width: "90%", borderColor: colors.border, borderWidth: 1, margin: 10 }}>
                    <MyText style={{ fontSize: 30, textAlign: "center", color: colors.text }}>
                        Total Domains
                    </MyText>
                    <MyText style={{ fontSize: 40, textAlign: "center", color: colors.text  }}>
                        {count}
                    </MyText>
                </View>
        </TouchableHighlight>

    );

}

