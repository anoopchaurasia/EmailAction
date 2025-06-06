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
import { TouchableOpacity, Text,  View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import BottomBar from '../component/BottomBarView';

import MessageService from '../../realm/EmailMessageService';
import MessageEvent from '../../event/MessageEvent';
import MyText from './../component/MyText'
import { useTheme } from '@react-navigation/native';
const monthMap = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04",
  May: "05", Jun: "06", Jul: "07", Aug: "08",
  Sep: "09", Oct: "10", Nov: "11", Dec: "12"
};
const formatDate = (original) => {
    const isoString = original
  .replace(/^.*?(\w{3}) (\w{3}) (\d{2}) (\d{2}:\d{2}:\d{2}) GMT([+-]\d{2}:\d{2}) (\d{4})$/, 
           (_, day, month, date, time, offset, year) => {
             return `${year}-${monthMap[month]}-${date}T${time}${offset}`;
           });
    const finalDate = new Date(isoString);
    return finalDate.toDateString();
};

const EmailList = ({ route, navigation }) => {
    let colors = useTheme().colors;
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
        MessageEvent.emit('email_list_view_trash', route.params);
        navigation.goBack();
    }

    function createRuleForSelected() {
        MessageEvent.emit('email_list_view_create_rule', route.params);
        navigation.goBack();
    }

    useEffect(x => {
        setLoading(true);
        if(route.params.type==="domain") {
           MessageService.getByDomain(route.params.sender, page, 10).then(messages => {
                setList(l => { l.push(...messages); return l; });
                setLoading(false);
            });
        } else {
          MessageService.getBySender(route.params.sender, page, 10).then(messages => {
            console.log("EmailListView", messages.length, messages[0]);
            setList(l => { l.push(...messages); return l; });
            setLoading(false);
          });
        }
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

    let styles = StyleSheet.create({
        label:{
            fontSize: 10,
            padding: 3,
            paddingTop: 4,
            lineHeight: 10,
            height: 15,
            borderRadius: 10,
            margin: 2,
            borderColor: colors.border,
            backgroundColor:colors.border
        }
    })

    
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={x=> navigation.navigate("EmailView", {message_id: item.message_id})} style={{ padding: 10, borderBottomWidth: 1, borderColor: colors.border }}>
                <MyText>{item.sender_name} ({item.sender})</MyText>
                <MyText style={{ fontWeight: 'bold' }}>{item.subject}</MyText>
                <MyText>{formatDate(item.date)}</MyText>
                
                {/* <View style={{flexDirection:"row", flex:1, alignContent:"flex-start"}}>{item.labels.map(x=> ( <MyText key={x} style={{...styles.label, borderColor: colors.border}}> {LabelService.getNameById(x)} </MyText> ) )}</View> */}
            </TouchableOpacity>
        );
    };

    return (
        <>
            <View style={{height: 40, backgroundColor:colors.background, alignContent:"center", alignItems:"center", paddingTop: 10, shadowColor:colors.border, shadowOffset:10}}>
                <MyText>Emails from {route.params.sender}</MyText>
            </View>
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