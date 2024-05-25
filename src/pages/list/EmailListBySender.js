import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import BottomBar from '../component/BottomBarView';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // You need to install this library for icons
import MessageAggregateService from './../../realm/EmailAggregateService';
import ActivityService from './../../realm/ActivityService';
import MessageEvent from "../../event/MessageEvent";
import MyText from './../component/MyText';
import { useTheme } from '@react-navigation/native';
import SearchPage from './../component/SearchPage';
import MyCheckbox from "../component/MyCheckbox";


export default ListView = ({ navigation, removeFromList }) => {
    let [list, setList] = useState([]);
    let [page, setPage] = useState(1);
    let [active, setActive] = useState(false);
    let [selectedList, setSelectedList] = useState({});
    let colors = useTheme().colors;
    // Declare a state variable to store the text input value
    const [text, setText] = useState('');
    let actionList = [{
        name: "Trash",
        icon: "trash-can",
        action: x=> trashSelectedSenders()
    },
    {
        name: "Copy",
        icon: "content-copy",
        action: x=> copySelectedSenders()
    }
    , {
        name: "Rule",
        icon: "set-merge",
        action: x=> createRuleForSelectedSenders()
    }];

    useEffect(x=>{
        let rm1 = MessageEvent.on('message_aggregation_changed', x=>{
            setActive(false);
          ///  setSelectedList({}); will create problem incase we fetch messages
            let list = MessageAggregateService.readMessage();
            setList(list);
        }, true);
        let rm2 = MessageEvent.on('email_list_view_trash', ({sender, type})=>{
            trashSelectedSenders([sender]);
        }, true);
        let rm3 = MessageEvent.on("email_list_view_create_rule", ({sender,type})=>{
            createRuleForSelectedSenders([sender]);
        }, true);
        return x=> {[rm1, rm2, rm3].forEach(x=>x())}
    }, []);

    function trashSelectedSenders(senders) {
        let from = senders || Object.keys(selectedList);
        let activity = ActivityService.createObject({from, type:"sender", to_label:"TRASH", action: "trash", from_label:"INBOX", title: `All emails from ${from.join(", ").slice(0, 70)}`});
        MessageEvent.emit("created_new_rule", activity);
    }

    function copySelectedSenders(senders) {
       createRuleForSelectedSenders(senders, 'copy');
    }

    function createRuleForSelectedSenders(senders, action="move") {
        navigation.navigate('CreateRuleView', {activity: {from: senders || Object.keys(selectedList), action, type:"sender"}})
    }

    useEffect(x => {
        let list = MessageAggregateService.readMessage();
        setList(list);
    }, []);

    useEffect(() => {
        if (Object.keys(selectedList).length === 0) setActive(false);
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
        console.log(item.sender, "item sender");
        setSelectedList(x => ({
            ...x, [item.sender]: 1
        }))
        setActive(true);
    }

    function hanldePress(item) {
        navigation.navigate("EmailListView", { sender: item.sender, show_bottom_bar: true })
    }

    const filterItems = (value) => {
        if (value === '') {
            return list.slice(0, page * 20);
        }
        value = value.toLowerCase();
        return list.filter((item) => item.sender.toLowerCase().includes(value)).slice(0, page * 20);
    };

    function RenderItem({ item, selected=false, handleLongPress, hanldePress }) {
        return (
            <TouchableOpacity style={{...SenderListstyles.item, backgroundColor: selected? colors.selected: colors.card,}} onLongPress={()=> handleLongPress(item)} onPress={x=>hanldePress(item)}>
                <MyCheckbox onPress={()=> handleLongPress(item)} selected={selected}/>
                <View style={SenderListstyles.details}>
                    <MyText style={SenderListstyles.title}>{item.sender_name} ({item.sender}) </MyText>
                    <MyText style={{...SenderListstyles.label, borderColor: colors.border, backgroundColor:colors.border}}>{item.count}</MyText>
                </View>
            </TouchableOpacity>
        )
    }

    // Define a function to handle text change
    const handleChangeText = (value) => {
        // Update the state variable with the new value
        setText(value);
        Object.keys(selectedList).length && setSelectedList({});
    };

    const handleEndReached = () => {
        // Increment the page number by one
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
             <SearchPage  onChangeText={handleChangeText}  placeholder="Search Sender"  value={text} name="magnify" />
            <FlatList
                data={filterItems(text)}
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
        backgroundColor:"#ccc",
        fontSize: 12,
        padding: 6,
        paddingHorizontal:10,
        paddingTop: 2,
        lineHeight: 20,
        height: 25,
        borderColor: "#ccc",
        borderRadius: 5,
    },
    item : {
        elevation: 0,
        backgroundColor: 'white',
        borderRadius: 0,
        flexDirection:"row",
        marginTop: 0,
        borderBottomColor:"#ddd",
        borderBottomWidth:1,
    },


    details: {
        padding: 5,
        paddingLeft: 0,
        paddingVertical: 13,
        flexDirection:"row",
        flex:1
    },
    email: {
        fontSize: 12,
    },
    title: {
      fontSize: 14,
      flex:1
      
    },
    count: {
      fontSize: 11,
      textAlign: "right",
      color: '#888',
    },
});