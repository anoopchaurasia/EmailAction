
import React, { useEffect, useState, } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ActivityModel from '../../realm/ActivityService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LabelService from '../../realm/LabelService';
import { useTheme } from '@react-navigation/native';
import SearchPage from './../component/SearchPage';
import MyDate from './../../utility/MyDate';
// Create a realm instance with the schemas
import MyText from './../component/MyText'
let MyIcon = (item, name, handlePress, size = 25, color = "#900") => {
  return (
    <TouchableOpacity onPress={x => handlePress(item)}>
      <Icon name={name} size={size} color={color} />
    </TouchableOpacity>
  )
}

function handlePress() {
  console.log("pressedddd");
}

// Define a function to render each item in the flat list
const renderItem = (item, onPlay, onDelete, onEdit, colors) => {
  let title = item.title || `${item.action} from ${item.to.toString()} ${item.from.toString()}`
  return (
    <View style={{ flexDirection: "row", padding: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', }}>
      <View style={{ flexDirection: "column", flex: 1, marginRight: 70, }}>
        <MyText style={{}}>{title}</MyText>
        <View style={{ flexDirection: "row" }}>
          <MyText>{Date.dateView(item.ran_at)} </MyText>
          <MyText style={{ ...styles.label, borderColor: colors.border }}>{LabelService.getNameById(item.from_label)}</MyText>
          <Icon name="arrow-right" />
          <MyText style={{ ...styles.label, borderColor: colors.border }}>{LabelService.getNameById(item.to_label)}</MyText>
        </View>
      </View>
      <View style={{ width: 70, flexDirection: "row" }}>
        {MyIcon(item, "pencil-outline", onEdit)}
        {item.completed ? MyIcon(item, "play", onPlay) : MyIcon(item, "circle-outline", handlePress)}
        {MyIcon(item, "delete", onDelete)}
      </View>
    </View>
  );
};

const ActivityView = ({ navigation }) => {
  // Get all the activities from the realm
  let colors = useTheme().colors;
  let [activities, setActivities] = useState([]);
  let [text, setText] = useState('');
  const isFocused = useIsFocused();

  function createRuleList() {
    ActivityModel.getAll().then(activities => {
      let all = [...activities];
      all.filter(x => !x.action).forEach(task => {
       
        if (task.to_label === 'trash') {
          ActivityModel.updateObjectById(task.id, { action: 'trash' });
        } else if (task.from_label && task.to_label) {
          ActivityModel.updateObjectById(task.id, { action: 'move' });
        } else if (task.to_label) { ////copy if we are not removing existing labels
          ActivityModel.updateObjectById(task.id, { action: 'copy' });
        }
      })
      setActivities(all);
    });

  }



  useEffect(x => {
    createRuleList();
    return (() => setActivities([]))
  }, [isFocused]);
  async function onPlay(item) {
    ActivityModel.updateObjectById(item.id, { completed: false });
    let index = activities.indexOf(item);
    item.completed = false;
    index != -1 && activities.splice(index, 1, { ...item });
    setActivities(c => [...c]);
  }
  const filterItems = (value) => {
    if (value === '') {
      return activities;
    }
    value = value.toLowerCase();
    return activities.filter((item) => item.from.filter(email => email.toLowerCase().includes(value)).length > 0);
  };
  async function onDelete(item) {
    Alert.alert("Delete message", "Do you wants to delete the Rule: " + item.title, [{
      text: 'Yes', onPress: () => {
        ActivityModel.deleteObjectById(item.id);
        createRuleList();
      }
    }, { text: "Cancel" }]);
  };

  async function onEdit(item) {
    navigation.navigate('CreateRuleView', { activity: item });
  }

  return (
    <View style={{ flex: 1 }}>
      <SearchPage onChangeText={value => setText(value)} placeholder="Search Rules" value={text} name="magnify" />
      <FlatList
        data={filterItems(text)}
        renderItem={({ item }) => renderItem(item, onPlay, onDelete, onEdit, colors)}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ActivityView;

let styles = StyleSheet.create({
  label: {
    backgroundColor: "#ccc",
    fontSize: 10,
    padding: 3,
    paddingTop: 4,
    lineHeight: 10,
    height: 15,
    borderRadius: 5
  }
})