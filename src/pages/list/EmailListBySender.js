import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, Modal, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import BottomBar from '../component/BottomBarView'
import MessageAggregateService from './../../realm/EmailAggregateService';
import AggregateData from "../../data/AggregateData";
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

export default ListView = ({ navigation, removeFromList }) => {
    let [list, setList] = useState([]);
    let [page, setPage] = useState(1);
    let [selected, setSelected] = useState({});
    // Declare a state variable to store the text input value
    const [text, setText] = useState('');

    useEffect(x => {
        let list = MessageAggregateService.readMessage();
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

            <View style={{ flexDirection: "row", borderBottomWidth: .5, borderBottomColor: "#ccc",  padding: 10 }}>
                <View style={{ flexDirection: "column", flex: 1 }}>
                    <Text onPress={x => navigation.navigate("EmailListView", { sender: item.sender, show_bottom_bar: true })} style={{ flex: 1 }}>{item.sender_name}({item.sender}) </Text>
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

