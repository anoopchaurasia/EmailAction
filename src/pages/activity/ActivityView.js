
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import ActivityModel from '../../realm/ActivityService';
// Create a realm instance with the schemas

// Define a function to render each item in the flat list
const renderItem = ({ item }) => {
  return (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
      <Text>To {item.to_label},  completed: {item.completed ? 'Yes' : 'No'}, {item.created_at.toISOString()}</Text>
    </View>
  );
};

const ActivityView = () => {
  // Get all the activities from the realm
    let activities = ActivityModel.getAll();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ActivityView;