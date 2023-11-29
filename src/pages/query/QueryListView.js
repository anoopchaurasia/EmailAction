import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Modal, Button, TouchableOpacity} from 'react-native';
import QueryService from '../../realm/QueryMessageService';
import QueryView from './QueryView';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

let MyIcon = (item, name, handlePress, size = 30, color = "#900") => {
  return (
    <TouchableOpacity onPress={x => handlePress(item)}>
      <Icon name={name} size={size} color={color} />
    </TouchableOpacity>
  )
}


const renderItem = (item, navigation, onEdit, onDelete) => {
  return <View style={{flexDirection:"row", padding: 10, margin:2, borderColor:"#ddd", borderWidth:1}}>
    <Text onPress={x=> navigation.navigate("AttachementView", {query: item})} style={{flex:1}}>
      <Text >Name: {item.name} {item.message_ids.length}</Text>
      <Text> Query: {item.query}</Text>
    </Text>
    {MyIcon(item, "pencil-outline", onEdit)}
      {MyIcon(item, "delete",  onDelete) }
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

    function onEdit(item){

    }

    function onDelete(item){
      QueryService.delete(item.query);
      let index = queryList.indexOf(item);
      index !=-1 && queryList.splice(index, 1);
    }

  return (
    <View>
      <View style={{height:40, }}>
            <Button style={{height: 40}} height={40} title="Search" onPress={x=> setOpenSearch(true)} />
        </View>
        <FlatList
          data={list}
          renderItem={({item})=> renderItem(item, navigation, onEdit, onDelete)}
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