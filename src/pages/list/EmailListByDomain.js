import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import BottomBar from '../component/BottomBarView';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // You need to install this library for icons
import MessageAggregateService from './../../realm/EmailAggregateService';
import ActivityService from './../../realm/ActivityService';
import MessageEvent from './../../event/MessageEvent';
import SearchPage from '../component/SearchPage';
import MyCheckbox from "../component/MyCheckbox";
import MyText from './../component/MyText';
import { useTheme } from '@react-navigation/native';

/*
 actions need to be taken
  -

*/

export default EmailListByDomain = ({ navigation, removeFromList }) => {
    let colors = useTheme().colors;
    let [list, setList] = useState([]);
    let [page, setPage] = useState(1);
    let [active, setActive] = useState(false);
    let [selectedList, setSelectedList] = useState({});
     let [searchText, setSearchText] = useState('');
    // Declare a state variable to store the text input value
    const [text, setText] = useState('');
    let actionList = [{
        name: "Trash",
        icon: "trash-can",
        action: x => trashSelectedDomains()
    },
    {
        name: "Copy",
        icon: "content-copy",
        action: x => copySelectedDomain()
    }, {
        name: "Rule",
        icon: "set-merge",
        action: x => createRuleForSelectedDomain()
    }];

    async function trashSelectedDomains(senders) {
        let from = senders || Object.keys(selectedList)
        let activity = await ActivityService.createObject({ from, type: "domain", to_label: "TRASH", action: "trash", from_label: "INBOX", title: `All emails from ${from.join(", ").slice(0, 70)}` }).catch(err => {
            console.error("Error creating activity for trashing domains: ", err);
        }).then(activity => {
            if (!activity) return; 
            MessageEvent.emit('message_aggregation_changed', activity);
        });
    }

    function createRuleForSelectedDomain(senders, action = "move") {
        navigation.navigate('CreateRuleView', { activity: { from: senders || Object.keys(selectedList), action, type: "domain" } })
    }

    function copySelectedDomain(senders) {
        createRuleForSelectedDomain(senders, 'copy');
    }

    useEffect(x => {
        let rm1 = MessageEvent.on('message_aggregation_changed', x => {
            createList();
        }, true);
        let rm2 = MessageEvent.on('email_list_view_trash', ({ sender, type }) => {
            trashSelectedDomains([sender]);
        }, true);
        let rm3 = MessageEvent.on("email_list_view_create_rule", ({ sender, type }) => {
            createRuleForSelectedDomain([sender]);
        }, true);
        return x => { [rm1, rm2, rm3].forEach(x => x()) }
    }, []);


    function createList() {
        MessageAggregateService.getPageForDomain(searchText, page, 20).then(x => {
           
             let map = {};
            list.forEach(item => map[item.sender_domain] = 1);
            x = x.filter(item => !map[item.sender_domain]);
            console.log("MessageAggregateService.getPageForDomain ", list.length);
             setList(l=>[...l, ...x]);
        });
    }

    useEffect(createList, [page, searchText]);

    useEffect(() => {
        if (Object.keys(selectedList).length === 0) setActive(false); else setActive(true);
    }, [selectedList])

    function handleLongPress(item) {
        if (selectedList[item.sender]) {
            setSelectedList(x => {
                x = { ...x };
                delete x[item.sender];
                return x;
            });

            return
        }
        setSelectedList(x => ({
            ...x, [item.sender]: 1
        }))
    }

    function hanldePress(item) {

        //// goto pages/email/EmailListView'
        navigation.navigate("EmailListView", { sender: item.sender, type: 'domain', show_bottom_bar: true, title: "Emails from sender " + item.sender })
    }


 function RenderItem({ item, selected = false, handleLongPress, hanldePress, active }) {
    return (
        <TouchableOpacity
            style={{
                ...SenderListstyles.item,
                backgroundColor: selected ? colors.selected : colors.card,
            }}
            onLongPress={() => handleLongPress(item)}
            onPress={() => hanldePress(item)}
        >
            <MyCheckbox onPress={() => handleLongPress(item)} selected={selected} />
            <View style={SenderListstyles.details}>
                
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    <MyText style={SenderListstyles.title}>
                        {item.sender_name || ""} {item.sender_domain}
                    </MyText>
                    <View style={{ flex: 1 }} />
                    <MyText
                        style={{
                            ...SenderListstyles.label,
                            borderColor: colors.border,
                            backgroundColor: colors.border,
                        }}
                    >
                        {item.aggregate_count}
                    </MyText>
                </View>
            </View>
        </TouchableOpacity>
    );
}



    // Define a function to handle text change
       const handleChangeText = (value) => {
        if(page==1 && value.trim() === "") return; // Do not update if the text is same as previous
        // Update the state variable with the new value
        setList([]);
        setPage(1);
        setSearchText(value);
        Object.keys(selectedList).length && setSelectedList({});
    };

    const handleEndReached = () => {
        // Increment the page number by one
        setPage((prevPage) => prevPage + 1);
    };
    return (
        <View style={{ flex: 1, flexDirection: "column", }}>
            <SearchPage onChangeText={handleChangeText} placeholder="Search Domain" value={text} name="magnify" />
            <FlatList
                data={list}
                initialNumToRender={20}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.3}
                style={{ flex: 1, marginBottom: 10 }}
                renderItem={({ item }) => <RenderItem active={active} selected={selectedList[item.sender] === 1} handleLongPress={handleLongPress} hanldePress={hanldePress} item={item} />
                }
                keyExtractor={(item) => item.sender}
                contentContainerStyle={{ marginBottom: 50, margintop: 10 }}
            />
            <BottomBar visible={active} list={actionList} />
        </View>
    )
}


const SenderListstyles = StyleSheet.create({
    label: {
        backgroundColor: "#ccc",
        fontSize: 12,
        padding: 6,
        paddingHorizontal: 10,
        paddingTop: 2,
        lineHeight: 20,
        height: 25,
        borderColor: "#ccc",
        borderRadius: 5,
    },
    item: {
        elevation: 0,
        backgroundColor: 'white',
        borderRadius: 0,
        flexDirection: "row",
        marginTop: 0,
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
    },


  details: {
    padding: 5,
    paddingLeft: 0,
    paddingVertical: 13,
    flexDirection: "row",
    flex: 1,
    alignItems: "center" // added to vertically align icon + text
},
    email: {
        fontSize: 12,
    },
title: {
    fontSize: 14,
    maxWidth: "70%", // prevent it from occupying entire row
    overflow: 'hidden'
},
    count: {
        fontSize: 11,
        textAlign: "right",
        color: '#888',
    },
});