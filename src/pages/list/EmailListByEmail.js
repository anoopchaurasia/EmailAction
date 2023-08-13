import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import EMailMessageSerive from '../../realm/EmailMessageService';

export default ListView = ({ navigation, removeFromList }) => {
    let [list, setList] = useState([]);
    let [page, setPage] = useState(1);
    let [selected, setSelected] = useState({});
    // Declare a state variable to store the text input value
    const [text, setText] = useState('');

    useEffect(x => {
        let list = EMailMessageSerive.getLatestMessages(page, 20);
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
        return (
            <TouchableOpacity style={EmailListstyles.item} onPress={x=>navigation.navigate("EmailListView", {sender: item.sender})}>
                <Text style={EmailListstyles.title}>{item.sender_name}  <Text style={EmailListstyles.email}> {item.sender}</Text></Text>
                <Text style={EmailListstyles.title}>{item.subject}</Text>
            </TouchableOpacity>
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
                keyExtractor={(item) => item.message_id}
                contentContainerStyle={{ marginBottom: 50, margintop: 10 }}
            />

        </View>
    )
}





const EmailListstyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f0f0f0',
    },
    item: {
      backgroundColor: 'white',
      padding: 10,
      marginVertical: 0,
      borderRadius: 8,
      elevation: 2,
    },
    email: {
        fontSize: 12,
    },
    title: {
      fontSize: 14,
    },
    count: {
      fontSize: 14,
      textAlign: "right",
      color: '#888',
    },
  });