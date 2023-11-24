import { useEffect, useState } from "react";
import {Text, View } from "react-native";
import MessageAggregateService from './../../realm/EmailAggregateService';
import MessageEvent from "../../event/MessageEvent";

export default function DomainSummary() {
    
    const [count, setCount]=useState(-1);
    let [fetchCount, setFetchCount] = useState(0);


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
        MessageEvent.on('new_message_received', x=>setFetchCount(x=> x+1))
    },[]);

    return (
        <View>
            <View style={{ width: "90%", borderColor: "#ddd", borderWidth: 1, margin: 10 }}>
                    <Text style={{ fontSize: 30, textAlign: "center" }}>
                        Total Domains
                    </Text>
                    <Text style={{ fontSize: 40, textAlign: "center" }}>
                        {count}
                    </Text>
                </View>
        </View>

    );

}

