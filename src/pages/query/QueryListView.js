import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Modal, Button, } from 'react-native';
import QueryService from '../../realm/QueryMessage';
import QueryView from './QueryView';

const renderItem = (item, navigation) => {
  return <View >
    <Text onPress={x=> navigation.navigate("AttachementView", {query: item})}>Name: {item.name}</Text>
    <Text>Query: {item.query}</Text>
    <Button title="Delete" onPress={x=> QueryService.delete(item.query)} />
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
                    QueryService.update(query);
                    setOpenSearch(false);
                }} />
            </Modal>
    </View>
  );
};

export default App;