// Date: 2021/8/14
//  Author: Anoop
//  Description: EmailListView.js is created for showing the list of emails
//  that are received from the sender.
//  It also has the bottom bar which has the options to move to trash, go to next and previous email.
//  It also has the search bar to search the emails by sender name.
//  It also has the checkbox to select the emails and move to trash.
//  It also has the refresh button to refresh the emails.
//  It also has the option to select all the emails and move to trash.

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import BottomBar from '../component/BottomBarView';

import MessageService from '../../realm/EmailMessageService';
import MessageEvent from '../../event/MessageEvent';

const formatDate = (date) => {
    
    return date.toDateString();
};

const EmailList = ({ route, navigation }) => {
    const [page, setPage] = useState(1);
    let [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    const bottomList = [
        {
            name: 'Prev',
            icon: "chevron-left",
            action: gotoPrev
        },
        {
            name: 'Trash',
            icon: "delete-restore",
            action: moveToTrash
        },
        {
            name: 'Next',
            icon: "chevron-right",
            action: goToNext
        }
    ]

    function moveToTrash() {
        navigation.goBack()
        MessageEvent.emit('goto_next_sender', { sender: route.params.sender })
        MessageEvent.emit('trash_the_sender', { sender: route.params.sender });
    }

    function gotoPrev() {
        navigation.goBack()
        MessageEvent.emit('goto_prev_sender', { sender: route.params.sender })
    }

    function goToNext() {
        navigation.goBack()
        MessageEvent.emit('goto_next_sender', { sender: route.params.sender })

    }

    useEffect(x => {
        
        setLoading(true);
        let ll = MessageService.getBySender(route.params.sender, page, 10);
        setList(l => { l.push(...ll); return l; });
        setLoading(false);
    }, [page]);

    const renderFooter = () => {
        
        if (loading) {
            return <ActivityIndicator size="large" color="#0000ff" />;
        }
        
        return null;
    };

    
    const handleEndReached = () => {
        
        setPage((prevPage) => prevPage + 1);
    };



    
    const renderItem = ({ item }) => {
        return (
            <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
                <Text>{item.sender_name}</Text>
                <Text onPress={x=> navigation.navigate("BySenderView", {message_id: item.message_id})} style={{ fontWeight: 'bold' }}>{item.subject}</Text>
                <Text>{formatDate(item.date)}</Text>
                <Text>{item.labels.join(', ')}</Text>
                {/* {item.attachments.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {item.attachments.map((attachment) => (
                <Attachment key={attachment.id} attachment={attachment} />
            ))}
            </View>
        )} */}
            </View>
        );
    };

    return (
        <>
            <FlatList
                data={list}
                renderItem={renderItem}
                keyExtractor={(item) => item.message_id}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
            />
            <BottomBar
                visible={route.params.show_bottom_bar || false}
                list={bottomList}
            />
        </>
    );
};

export default EmailList;