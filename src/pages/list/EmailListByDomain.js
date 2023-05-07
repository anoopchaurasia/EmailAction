import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, Modal, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import BottomBar from '../component/BottomBarView'
import MessageAggregateService from './../../realm/EmailAggregateService';
import AggregateData from "../../data/AggregateData";

export default ListView = ({ navigation, removeFromList }) => {
    let [list, setList] = useState([]);
    let [page, setPage] = useState(1);
    let [selected, setSelected] = useState({});
    // Declare a state variable to store the text input value
    const [text, setText] = useState('');

    useEffect(x => {
        let list = MessageAggregateService.readMessage();
        let domaoins = {};
        list.forEach(x => {
            let domain = x.sender_domain;
            if (!domaoins[domain]) {
                domaoins[domain] = 0;
            }
            domaoins[domain] += x.count;
        });
        list = Object.keys(domaoins).map(x => {
            return {
                sender: x,
                count: domaoins[x]
            }
        });
        setList(list);
    }, []);

    const filterItems = (value) => {
        if (value === '') {
            return list.slice(0, page * 20);
        }
        value = value.toLowerCase();
        return list.filter((item) => item.sender.toLowerCase().includes(value)).slice(0, page * 20);
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
                    }}
                />
                <View style={{ flexDirection: "column", flex: 1 }}>
                    <Text onPress={x => navigation.navigate("EmailListView", { sender: item.sender, show_bottom_bar: true })} style={{ flex: 1 }}>{item.sender} </Text>

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

    // Define a function to handle text change
    const handleChangeText = (value) => {
        // Update the state variable with the new value
        setText(value);
    };

    const handleEndReached = () => {
        // Increment the page number by one
        setPage((prevPage) => prevPage + 1);
    };
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
                onEndReachedThreshold={0.3}
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

        </View>
    )
}

