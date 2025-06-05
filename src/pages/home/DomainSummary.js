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
        MessageAggregateService.getCountByDomain().then(c => {
            setCount(c);
        });
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

