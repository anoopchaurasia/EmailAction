import React, { useState, useEffect } from "react";
import { View, ToastAndroid, Modal, StyleSheet, TouchableOpacity } from "react-native";
import Utility from "../../utility/Utility";
import EmailList from "./EmailListByEmail.js";
import EmailListBySender from "./EmailListBySender";
import EmailListByDomain from "./EmailListByDomain.js";
import BottomBar from "../component/BottomBarView";
import MoveToLabelView from "../component/MoveToLabelView";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function MultiEmailView() {
    let [openLabelSelect, setOpenLabelSelect] = useState(false);
    //let [selectedAction, setSelectedAction] = useState("");
    let [currentView, setCurrentView] = useState('sender');
    useEffect(() => {
        Utility.getData("currentView").then((data) => {
            if (data) setCurrentView(data);
            ToastAndroid.show('Selected View '+ data, ToastAndroid.LONG);
        })
    }, []);
    let topSelections = [
        {
            name: 'email',
            icon: "email-outline",
        },
        {
            name: 'domain',
            icon: "domain",
        },
        {
            name: 'sender',
            icon: "send-outline",
        },

    ]


    // const bottomList = [
    //     {
    //         name: 'Trash',
    //         icon: "delete-restore",
    //         action: moveToTrash
    //     },
    //     {
    //         name: 'Copy',
    //         icon: "content-copy",
    //         action: copyToFolder
    //     },
    //     {
    //         name: 'Move',
    //         icon: "file-move",
    //         action: moveToFoldeer
    //     }
    // ]

    // function copyToFolder() {
    //     if (Object.values(selected).length == 0) return console.log("no selection");
    //     setSelectedAction('copy');
    //     setOpenLabelSelect(true);
    // }
    // function moveToFoldeer() {
    //     if (Object.values(selected).length == 0) return console.log("no selection");
    //     setSelectedAction('move');
    //     setOpenLabelSelect(true);
    // }


    async function setSelectedLabel(label) {
        await commonAction(async sender=> await ProcessRules.createNewRule(label, sender, selectedAction)).catch(e=>{
            if(e.message == 'rule already exist') return Alert.alert('Rule already exist', "There is already a rule for this sender. Please delete the rule and try again.");
        });
        setSelectedAction('');
        setOpenLabelSelect(false);
    }

    // async function commonAction(action) {
    //     if (Object.values(selected).length == 0) return console.log("no selection");
    //     console.log('action', Object.values(selected).map(x => x.sender));
    //     let senders = Object.values(selected).map(x => x.sender);
    //     let newlist = list.map(x => x);
    //     for (let i = 0; i < senders.length; i++) {
    //         let sender = senders[i];
    //         await action(sender);
    //         MessageAggregateService.deleteBySender(sender);
    //         let index = newlist.indexOf(selected[sender]);
    //         delete selected[sender];
    //         console.log(newlist.length);
    //         index != -1 && newlist.splice(index, 1);
    //         console.log(index, selected, newlist.length);
    //     }
    //     setList(newlist);
    //     setSelected({});
    // }

    // async function moveToTrash() {
    //     await commonAction(async sender=> await ProcessRules.createNewRule({to_label:"trash"}, sender, 'trash')).catch(e=>{
    //         if(e.message == 'rule already exist') return Alert.alert('Rule already exist', "There is already a rule for this sender. Please delete the rule and try again.");
    //     });
    // }


    

    // function getItemFromSender(sender) {
    //     let item = list.find(l => l.sender == sender);
    //     let index = list.indexOf(item);
    //     console.log('next', sender, item, index, list.length);
    //     return { item, index };
    // }

    // function trashBySender(x) {
    //     let item = list.find(l => l.sender == x.sender);
    //     selected[x.sender] = item;
    //     moveToTrash();
    // }

    // function goToNext(x) {
    //     let { item, index } = getItemFromSender(x.sender);
    //     list[index + 1] && navigation.navigate("EmailListView", { sender: list[index + 1].sender, show_bottom_bar: true })
    // }

    // function goToPrev(x) {
    //     let item = list.find(l => l.sender == x.sender);
    //     let index = list.indexOf(item);
    //     list[index - 1] && navigation.navigate("EmailListView", { sender: list[index - 1].sender, show_bottom_bar: true })
    // }

    // useEffect(x => {
    //     let remove1 = MessageEvent.on('trash_the_sender', trashBySender);
    //     let remove2 = MessageEvent.on('goto_next_sender', goToNext);
    //     let remove3 = MessageEvent.on('goto_prev_sender', goToPrev);
    //     return (x => { remove1(); remove2(); remove3(); console.log("removed") });
    // }, [list, selected])

  



    useEffect(x => {
        Utility.saveData("currentView", currentView);
    }, [currentView]);


    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
                {topSelections.map(x => (<TouchableOpacity key={x.name} onPress={y => setCurrentView(x.name)} style={{ alignItems: 'center' }}>
                    <Icon style={{ ...styles.icon, opacity: currentView == x.name ? 1 : .2 }} name={x.icon} size={26} />
                </TouchableOpacity>))}
            </View>
            {/* {currentView =='sender' && <EmailListBySender visible={currentView === "sender"} />}
            {currentView=='domain' && <EmailListByDomain visible={currentView === "domain"} />}  */}
            {currentView=='email' && <EmailList visible={currentView === "email"} />}
            <Modal
                animationType="slide"
                transparent={false}
                visible={openLabelSelect}
                onRequestClose={() => {
                    setOpenLabelSelect(false);
                }}
            >
                <MoveToLabelView setSelectedLabel={setSelectedLabel} onClose={x => setOpenLabelSelect(false)} />
            </Modal>
        </View>
    );
}

let styles = StyleSheet.create({
    icon: {
        margin: 10,
        marginHorizontal: 20,
        opacity: 0.5
    },
    selected: {
        opacity: 1
    }
});



const EmailListstyles = StyleSheet.create({
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