import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, Modal, Button, } from 'react-native';
import MessageService from '../../realm/EmailMessageService';

export default function App({navigation}) {
 const [senderList, setSenderList] = useState([]);

    useEffect(() => {
        let senderList = MessageService.getLatestMessages(1, 100);
        let senders = {};
        senderList.map(x=> {
            if(!senders[x.sender]) {
                senders[x.sender] = [];
            }
            senders[x.sender].push(x);
        });
        setSenderList(Object.keys(senders).map(x=> ({sender: x, messages: senders[x].filter(x=>x.labels.indexOf("UNREAD")>=0) })));
    }
    , []);

    return (
        <View style={{ flex: 1, padding: 24 }}>
            <FlatList
            
                data={senderList}
                renderItem={({ item }) => (
                    <View style={{flexDirection:"row", padding: 10, margin:2, borderColor:"#ddd", borderWidth:1}}>
                        <Text onPress={x=>navigation.navigate("EmailListView", {sender: item.sender})} style={{flex:1}}>{item.sender}</Text>
                        <Text style={{width:40}}>{item.messages.length}</Text>
                    </View>
                )}
                keyExtractor={item => item.sender}
            />
        </View>
    );
}