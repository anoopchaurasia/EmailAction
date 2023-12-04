import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import MessageService from '../../realm/EmailMessageService';
import MyText from './../component/MyText'

export default function App({navigation}) {
 const [senderList, setSenderList] = useState([]);

    useEffect(() => {
        let senderList = MessageService.getLatestMessages(1, 100);
        let senders = {};
        senderList.map(x=> {
            if(!senders[x.sender]) {
                senders[x.sender] = {sender_name: x.sender_name,list: []};
            }
            senders[x.sender].list.push(x);
        });
        setSenderList(Object.keys(senders).map(x=> ({sender: x, sender_name: senders[x].sender_name, messages: senders[x].list.filter(x=>x.labels.indexOf("UNREAD")>=0) })));
    }
    , []);

    return (
        <View style={styles.container}>
            <FlatList
            
                data={senderList}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={x=>navigation.navigate("EmailListView", {sender: item.sender})}>
                    <MyText style={styles.title}>{item.sender_name}  ({item.messages.length})</MyText>
                    <MyText style={styles.email}> {item.sender}</MyText>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.sender}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f0f0f0',
    },
    item: {
      backgroundColor: 'white',
      padding: 10,
      marginVertical: 8,
      borderRadius: 8,
      elevation: 2,
    },
    email: {
        fontSize: 12,
    },
    title: {
      fontSize: 16,
    },
    count: {
      fontSize: 14,
      textAlign: "right",
      color: '#888',
    },
  });