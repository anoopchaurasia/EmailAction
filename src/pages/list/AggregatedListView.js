import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Button, TextInput } from 'react-native';
import MessageAggregateService from "../../realm/EmailAggregate";
import { Checkbox } from 'react-native-paper';
import BottomBar from './bottombar'
import Helper from './_Helper';


export default ListView = ({navigation}) => {
    let [list, setList] = useState([]);
    let [selected, setSelected] = useState({});
     // Declare a state variable to store the text input value
    const [text, setText] = useState('');

    // Define a function to handle text change
    const handleChangeText = (value) => {
        // Update the state variable with the new value
        setText(value);
    };
    useEffect(x => {
       refershData()
    }, []);

    function refershData() {
        let list = MessageAggregateService.readMessage().slice(0, 200);
        setList(list);
        console.log("refresshed")
    };

    async function moveToTrash() {
        console.log('moving to trash', Object.values(selected).map(x => x.sender));
        let senders = Object.values(selected).map(x => x.sender);
        let newlist = list.map(x=>x);

        for(let i=0; i< senders.length; i++) {
            let sender = senders[i];
            await Helper.trashForSenderEmail(sender);
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

    async function onGoback(data, item) {
        let index = list.indexOf(item);
        console.log(index, data, item, "index, data, item");
        if(data?.action=="next") {
            let next = list[index+1];
            next && navigation.navigate("EmailListView",{sender: next.sender, onGoback: function(data) {onGoback(data, next)}});
            return
        }
        if(data?.action=="prev") {
            let next = list[index-1];
            next && navigation.navigate("EmailListView",{sender: next.sender, onGoback: function(data) {onGoback(data, next)}});
            return
        }
        if(data?.action!="trash") {
            return
        }
        let newlist = list.map(x=>x);
        let sender = data.sender;
        await Helper.trashForSenderEmail(sender);
        MessageAggregateService.deleteBySender(sender);

        delete selected[sender];
        console.log(newlist.length);
        index != -1 && newlist.splice(index, 1);
        console.log(index, selected, newlist.length);
        setList(newlist);
        setSelected({...selected});
        let next = newlist[index];
        next && navigation.navigate("EmailListView",{sender: next.sender, onGoback: function(data) {onGoback(data, next)}});
    }
    const filterItems = (value) => {
        // If the value is empty, return all items
        if (value === '') {
          return list;
        }
        value = value.toLowerCase();
        // Otherwise, return only the list that match the value
        return list.filter((item) => item.sender.toLowerCase().includes(value));
      };
    function RenderItem({ item, checked, onPress, onGoback }) {
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
                    <Text onPress={x =>navigation.navigate("EmailListView", {sender: item.sender, onGoback}) } style={{ flex: 1 }}>{item.sender} </Text>

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
                style={{ flex: 1, marginBottom: 10 }}
                renderItem={({ item }) => <RenderItem
                    checked={!!selected[item.sender]}
                    onGoback={x=> onGoback(x, item)}
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
            <BottomBar
                onDelete={x => console.log("onDelete")}
                onMove={x => refershData()}
                onTrash={x => moveToTrash()} />
        </View>
    )

}

