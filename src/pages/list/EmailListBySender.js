import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import BottomBar from '../component/BottomBarView'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // You need to install this library for icons
import MessageAggregateService from './../../realm/EmailAggregateService';
import AggregateData from "../../data/AggregateData";

export default ListView = ({ navigation, removeFromList }) => {
    let [list, setList] = useState([]);
    let [page, setPage] = useState(1);
    let [selectedList, setSelectedList] = useState({});
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

    function archieve(item){
        console.log("Archieve", item);
    }

    function Trash(){
        console.log("Trash");
    }

    function Rule(){
        console.log("Rule");
    }

    function handleLongPress(item) {
       
        if(selectedList[item.sender]) {
            return setSelectedList(x=> {
                x= {...x};
                delete x[item.sender];
                return x;
            })
        }
        setSelectedList(x=> ({
            ...x, [item.sender]:1
        }))
    }

    function hanldePress(item) {
        navigation.navigate("EmailListView", {sender: item.sender})
    }

    function RenderItem({ item, handleLongPress, hanldePress, selected }) {
        return (
            <TouchableOpacity style={{...EmailListstyles.item, backgroundColor: selected? 'red': ''}} onLongPress={()=> handleLongPress(item)} onPress={x=>hanldePress(item)}>
            <Text style={EmailListstyles.title}>{item.sender_name}  ({item.count})</Text>
            <Text style={EmailListstyles.email}> {item.sender}</Text>
          </TouchableOpacity>
        )
    }

    const handleChangeText = (value) => {
        setText(value);
    };

    const handleEndReached = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <View style={EmailListstyles.container}>
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
              keyExtractor={(item) => item.sender}
              contentContainerStyle={{ marginBottom: 50, margintop: 10 }}
              renderItem={({ item }) => <RenderItem selected={selectedList[item.sender]===1} handleLongPress={handleLongPress} hanldePress={hanldePress}  item={item} />
            }
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
    item : {
        padding: 10,
        elevation: 1,
        backgroundColor: 'white',
        borderRadius: 0,
        marginTop: 10
    },
    email: {
        fontSize: 12,
    },
    title: {
      fontSize: 14,
    },
    count: {
      fontSize: 11,
      textAlign: "right",
      color: '#888',
    },
  });