import { useEffect, useState } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import MessageAggregateService from './../../realm/EmailAggregateService';
import MessageEvent from "../../event/MessageEvent";
import { useTheme } from '@react-navigation/native';
import MyText from './../component/MyText';


export default function DomainSummary({ navigation }) {
    const [count, setCount] = useState(-1);
    const colors = useTheme().colors;
    MessageEvent.onNativeEvent(MessageEvent.NEW_MESSAGE_ARRIVED, (data) => {
        if (data && data.type == "email") {
            setCount(count => count + 1);
        }
    });

    function fetchCount() {
        MessageAggregateService.readAll().then(list => {

            let domains = {};
            list.forEach(x => {
                let domain = x.sender_domain;
                if (!domains[domain]) {
                    domains[domain] = { c: 0, sender_name: x.sender_name };
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
        });;
    }

    useEffect(() => {
        let rm2 = MessageEvent.onNativeEvent(MessageEvent.NEW_MESSAGE_BATCH_ADDED, (batch_number) => {
            fetchCount();
        });
        fetchCount();
        return () => {  rm2(); };
    }, []);

    return (
        <TouchableHighlight underlayColor={colors.underlayColor} onPress={x => navigation.navigate("Domain")}>
            <View style={{ width: "90%", borderColor: colors.border, borderWidth: 1, margin: 10, marginLeft: "5%" }}>
                <MyText style={{ fontSize: 30, textAlign: "center", color: colors.text }}>
                    Total Domains
                </MyText>
                <MyText style={{ fontSize: 40, textAlign: "center", color: colors.text }}>
                    {count}
                </MyText>
            </View>
        </TouchableHighlight>

    );

}

