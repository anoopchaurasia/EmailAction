import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Modal, Button, TouchableOpacity } from 'react-native';
import QueryService from '../../realm/QueryMessageService';
import QueryView from './QueryView';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomBar from '../component/BottomBarView';
import MyText from './../component/MyText';
import { useTheme } from '@react-navigation/native';

let MyIcon = (item, name, handlePress, size = 30, color = "#900") => {
  return (
    <TouchableOpacity onPress={x => handlePress(item)}>
      <Icon name={name} size={size} color={color} />
    </TouchableOpacity>
  )
}
const renderItem = (item, navigation, onEdit, onDelete, colors) => {
  return <View style={{ flexDirection: "row", padding: 10, margin: 2, borderColor: colors.border, borderWidth: 1 }}>
    <MyText onPress={x => navigation.navigate("AttachementView", { query: item })} style={{ flex: 1 }}>
      <MyText >Name: {item.name} {item.message_ids.length}</MyText>
      <MyText> Query: {QueryService.getQueryString(item.query)}</MyText>
    </MyText>
    {MyIcon(item, "pencil-outline", onEdit)}
    {MyIcon(item, "delete", onDelete)}
  </View>
};

const App = ({ navigation }) => {
  let colors = useTheme().colors;
  let [list, setList] = useState([]);
  let [openSearch, setOpenSearch] = useState(false);
  let [editQuery, setEditQuery] = useState(null);
  useEffect(x => {
   QueryService.getAll().then(x => {
      console.log("QueryService.getAll", x.map(q => q.id));
      let i = 0;
      x.forEach(element => {
        console.log("element", element.id, i);
        element.id = i++;
      });
      setList(x);
    });
  }, [])

  function onEdit(item) {
    setEditQuery(item);
    setOpenSearch(true);
  }

  function onDelete(item) {
    QueryService.delete(item.id);
    let index = list.indexOf(item);
    index != -1 && list.splice(index, 1);
  }
  function cleanQuery(query) {
    for (let x in query) {
      if (query[x] === '') delete query[x];
    }
  }

  let actionList = [{
    name: "+Create",
    icon: "trash-can",
    action: x => {
      setEditQuery({});
      setOpenSearch(true);
    }
  }];

  return (
    <View style={{ flexDirection: "column", flex: 1, marginBottom: 10 }}>
      <View style={{ flex: 1 }}>

        <FlatList
          data={list}
          renderItem={({ item }) => renderItem(item, navigation, onEdit, onDelete, colors)}
          keyExtractor={item => item.id}
        />
      </View>

      <View style={{ height: 40, }}>
        <BottomBar style={{ backgroundColor: "#ddd" }} list={actionList} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openSearch}
        onRequestClose={(query) => {
          setOpenSearch(false);
        }}
      >
        <QueryView query_init={editQuery} onClose={query => {
          query.message_ids = [];
          query.completed = false;
          cleanQuery(query.query);
          if(query.id === undefined) {
            QueryService.create(query).then(x => {
              if (x) {
                QueryService.getAll().then(x => {
                  setList(x);
                });
              }
            });
          } else {
            QueryService.update(query).then(x => {
          
            QueryService.getAll().then(x => {
              setList(x);
            });
          });
          }
          

          setOpenSearch(false);
        }} />
      </Modal>
    </View>
  );
};

export default App;