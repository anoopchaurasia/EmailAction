
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
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
      <Text style={{flex: 1}}>Move to {(item.to_label||item.to||"").toString()} from {item.from.toString()}</Text>
      {item.completed ? MyIcon(item, "play", onPlay) : MyIcon(item, "circle-outline", handlePress)}
      {MyIcon(item, "delete", onDelete)}
    </View>
  );
};

const ActivityView = () => {
  // Get all the activities from the realm
    let activities = ActivityModel.getAll();
  async function onPlay(item) {
    ActivityModel.updateObjectById(item.id, {completed: false});
  }

  async function onDelete() {

  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={activities}
        renderItem={({item})=> renderItem(item, onPlay, onDelete)}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ActivityView;