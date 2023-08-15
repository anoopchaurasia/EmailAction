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
import { TouchableOpacity, Text, FlatList, ActivityIndicator } from 'react-native';
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

    const bottomList = [{
        name: "Trash",
        icon: "trash-can",
        action: moveToTrash
    }, {
        name: "Rule",
        icon: "set-merge",
        action: createRuleForSelected
    }];

    function moveToTrash() {
        navigation.goBack();
    }

    function createRuleForSelected() {
        console.log("CreateRuleFor selected");
    }

    useEffect(x => {
        let ll;
        setLoading(true);
        if(route.params.type==="domain") {
            ll = MessageService.getByDomain(route.params.sender, page, 10);
        } else {
            ll = MessageService.getBySender(route.params.sender, page, 10);
        }
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
            <TouchableOpacity onPress={x=> navigation.navigate("EmailView", {message_id: item.message_id})} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
                <Text>{item.sender_name}</Text>
                <Text style={{ fontWeight: 'bold' }}>{item.subject}</Text>
                <Text>{formatDate(item.date)}</Text>
                <Text>{item.labels.join(', ')}</Text>
            </TouchableOpacity>
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