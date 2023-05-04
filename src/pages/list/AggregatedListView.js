import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, Modal, Alert } from 'react-native';
import MessageAggregateService from "../../realm/EmailAggregateService";
import { Checkbox } from 'react-native-paper';
import BottomBar from '../component/BottomBarView'
import MoveToLabelView from './../component/MoveToLabelView'
import Helper from './_Helper';
import MessageEvent from "../../event/MessageEvent";
import ProcessRules from "../../data/ProcessRules";


export default ListView = ({ navigation }) => {
    let [list, setList] = useState([]);
    let [page, setPage] = useState(1);
    let [selected, setSelected] = useState({});
    let [openLabelSelect, setOpenLabelSelect] = useState(false);
    let [selectedAction, setSelectedAction] = useState("");
    // Declare a state variable to store the text input value
    const [text, setText] = useState('');
    const bottomList = [
        {
            name: 'Trash',
            icon: "delete-restore",
            action: moveToTrash
        },
        {
            name: 'Copy',
            icon: "content-copy",
            action: copyToFolder
        },
        {
            name: 'Move',
            icon: "file-move",
            action: moveToFoldeer
        }
    ]

    function copyToFolder() {
        if (Object.values(selected).length == 0) return console.log("no selection");
        setSelectedAction('copy');
        setOpenLabelSelect(true);
    }
    function moveToFoldeer() {
        if (Object.values(selected).length == 0) return console.log("no selection");
        setSelectedAction('move');
        setOpenLabelSelect(true);
    }
    // Define a function to handle text change
    const handleChangeText = (value) => {
        // Update the state variable with the new value
        setText(value);
    };

    async function setSelectedLabel(label) {
        await commonAction(async sender=> await ProcessRules.createNewRule(label, sender, selectedAction)).catch(e=>{
            if(e.message == 'rule already exist') return Alert.alert('Rule already exist', "There is already a rule for this sender. Please delete the rule and try again.");
        });
        setSelectedAction('');
        setOpenLabelSelect(false);
    }

    async function commonAction(action) {
        if (Object.values(selected).length == 0) return console.log("no selection");
        console.log('action', Object.values(selected).map(x => x.sender));
        let senders = Object.values(selected).map(x => x.sender);
        let newlist = list.map(x => x);
        for (let i = 0; i < senders.length; i++) {
            let sender = senders[i];
            await action(sender);
            MessageAggregateService.deleteBySender(sender);
            let index = newlist.indexOf(selected[sender]);
            delete selected[sender];
            console.log(newlist.length);
            index != -1 && newlist.splice(index, 1);
            console.log(index, selected, newlist.length);
        }
        setList(newlist);
        setSelected({});
    }

    async function moveToTrash() {
        await commonAction(async sender=> await ProcessRules.createNewRule({to_label:"trash"}, sender, 'trash')).catch(e=>{
            if(e.message == 'rule already exist') return Alert.alert('Rule already exist', "There is already a rule for this sender. Please delete the rule and try again.");
        });
    }

    useEffect(x => {
        refershData();
    }, []);

      // A function that handles the end reached event of the FlatList
    const handleEndReached = () => {
        // Increment the page number by one
        setPage((prevPage) => prevPage + 1);
    };

    function getItemFromSender(sender) {
        let item = list.find(l => l.sender == sender);
        let index = list.indexOf(item);
        console.log('next', sender, item, index, list.length);
        return { item, index };
    }

    function trashBySender(x) {
        let item = list.find(l => l.sender == x.sender);
        selected[x.sender] = item;
        moveToTrash();
    }

    function goToNext(x) {
        let { item, index } = getItemFromSender(x.sender);
        list[index + 1] && navigation.navigate("EmailListView", { sender: list[index + 1].sender, show_bottom_bar: true })
    }

    function goToPrev(x) {
        let item = list.find(l => l.sender == x.sender);
        let index = list.indexOf(item);
        list[index - 1] && navigation.navigate("EmailListView", { sender: list[index - 1].sender, show_bottom_bar: true })
    }

    useEffect(x => {
        let remove1 = MessageEvent.on('trash_the_sender', trashBySender);
        let remove2 = MessageEvent.on('goto_next_sender', goToNext);
        let remove3 = MessageEvent.on('goto_prev_sender', goToPrev);
        return (x => { remove1(); remove2(); remove3(); console.log("removed") });
    }, [list, selected])

    function refershData() {
        let list = MessageAggregateService.readMessage();
        setList(list);
    };


    const filterItems = (value) => {
        if (value === '') {
            return list.slice(0, page*20);
        }
        value = value.toLowerCase();
        return list.filter((item) => item.sender.toLowerCase().includes(value)).slice(0, page*20);
    };
    function RenderItem({ item, checked, onPress }) {
        let [s, setS] = useState(checked || false);
        return (

            <View style={{ flexDirection: "row", borderBottomWidth: .2, borderBottomColor: "#eee", margin: 5, margintop: 10 }}>
                <Checkbox
                    status={s
                        ? 'checked' : 'unchecked'}
                    onPress={x => {
                        setS(r => !r);
                        onPress(s);
                    }

                    }
                />
                <View style={{ flexDirection: "column", flex: 1 }}>
                    <Text onPress={x => navigation.navigate("EmailListView", { sender: item.sender, show_bottom_bar: true })} style={{ flex: 1 }}>{item.sender_name} </Text>

                    {/* <Text style={{ fontSize: 9 }}>
                    {item.labels.map(x => x.id).map(id => <Text style={{ borderColor: "#ccc", backgroundColor: "#ccc", margin: 10 }} key={id}>{Label.getById(id).name} </Text>)}
                </Text> */}
                </View>
                <Text>
                    {item.count}
                </Text>

            </View>
        )
    }

    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={handleChangeText}
                value={text}
            />
            <FlatList
                data={filterItems(text)}
                initialNumToRender={20}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
                style={{ flex: 1, marginBottom: 10 }}
                renderItem={({ item }) => <RenderItem
                    checked={!!selected[item.sender]}
                    onPress={checked =>
                        setSelected(r => {
                            if (checked) {
                                delete selected[item.sender]
                            } else {
                                selected[item.sender] = item
                            }
                            return selected;
                        })
                    }
                    item={item} />}
                keyExtractor={(item) => item.sender}
                contentContainerStyle={{ marginBottom: 50, margintop: 10 }}
            />
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

            <BottomBar
                visible={true}
                list={bottomList} />
        </View>
    )
}

