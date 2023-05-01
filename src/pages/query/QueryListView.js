import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Modal, Button, } from 'react-native';
import QueryService from '../../realm/QueryMessageService';
import QueryView from './QueryView';

const renderItem = (item, navigation) => {
  return <View style={{flexDirection:"row", padding: 10, margin:2, borderColor:"#ddd", borderWidth:1}}>
    <Text onPress={x=> navigation.navigate("AttachementView", {query: item})} style={{flex:1}}>
      <Text >Name: {item.name}</Text>
      <Text> Query: {item.query}</Text>
    </Text>
    <Button style={{width:50}} title="Delete" onPress={x=> QueryService.delete(item.query)} />
  </View>
};

const App = ({navigation}) => {
    let [list, setList] = useState([]);
    let [openSearch, setOpenSearch] = useState(false);
    let [query, setQuery] = useState({});
    useEffect(x=>{
        let queryList  = QueryService.getAll();
        setList(queryList);
    }, [])

  return (
    <View>
      <View style={{height:40, }}>
            <Button style={{height: 40}} height={40} title="Search" onPress={x=> setOpenSearch(true)} />
        </View>
        <FlatList
          data={list}
          renderItem={({item})=> renderItem(item, navigation)}
          keyExtractor={item => item.query}
        />
         <Modal
                animationType="slide"
                transparent={true}
                visible={openSearch}
                onRequestClose={(query) => {
                    setOpenSearch(false);
                }}
            >
                <QueryView onClose={query=> {
                    console.log('Query', query);
                    setQuery(query);
                    query.message_ids=[];
                    QueryService.update(query);
                    setList(cl=> {cl.push(query); return cl;})
                    setOpenSearch(false);
                }} />
            </Modal>
    </View>
  );
};

export default App;