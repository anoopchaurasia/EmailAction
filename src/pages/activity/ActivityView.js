
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import ActivityModel from '../../realm/ActivityService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// Create a realm instance with the schemas

let MyIcon = (item, name, handlePress, size=30, color="#900") => {
  return (
    <TouchableOpacity onPress={x=> handlePress(item)}>
      <Icon name={name} size={size} color={color}  />
    </TouchableOpacity>
  )
}

function handlePress() {
  console.log("pressedddd");
}


// Define a function to render each item in the flat list
const renderItem = (item, onPlay, onDelete ) => {
  return (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', flexDirection:"row" }}>
      <Text style={{flex: 1}}>{item.action} to {(item.to_label||"").toString()} from {item.to.toString()} {item.from.toString()}</Text>
      {item.completed ? MyIcon(item, "play", onPlay) : MyIcon(item, "circle-outline", handlePress)}
      {MyIcon(item, "delete", onDelete)}
    </View>
  );
};

const ActivityView = () => {
  // Get all the activities from the realm
  
    let [activities, setActivities] = useState([]);
    let [text, setText] = useState('');

    useEffect(x=>{
      let all = ActivityModel.getAll();
        all.filter(x=>!x.action).forEach(task=>{
          if (task.to_label === 'trash') {
          ActivityModel.updateObjectById(task.id, {action:'trash'});
        } else if (task.from_label && task.to_label) {
          ActivityModel.updateObjectById(task.id, {action:'move'});
        } else if(task.to_label) { ////copy if we are not removing existing labels
          ActivityModel.updateObjectById(task.id, {action:'copy'});
        }
      })
      setActivities(all);
      return (() => setActivities([]))
    }, []);
  async function onPlay(item) {
    ActivityModel.updateObjectById(item.id, {completed: false});
    let index = activities.indexOf(item);
    item.completed= false;
    index!=-1 && activities.splice(index, 1, {...item});
    setActivities(c=>[...c]);
  }
  const filterItems = (value) => {
    if (value === '') {
        return activities;
    }
    value = value.toLowerCase();
    return activities.filter((item) => item.from.filter(email=> email.toLowerCase().includes(value)).length>0 );
};
  async function onDelete() {

  };
  return (
    <View style={{ flex: 1 }}>
       <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={value=> setText(value)}
                value={text}
            />
      <FlatList
        data={filterItems(text)}
        renderItem={({item})=> renderItem(item, onPlay, onDelete)}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ActivityView;