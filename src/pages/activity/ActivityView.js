
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import ActivityModel from './../../realm/Activity';
// Create a realm instance with the schemas

// Define a function to render each item in the flat list
const renderItem = ({ item }) => {
  return (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
      <Text>Message ids: {item.message_ids.join(', ')}</Text>
      <Text>From label: {item.from_label}</Text>
      <Text>To label: {item.to_label}</Text>
      <Text>Is reverted: {item.is_reverted ? 'Yes' : 'No'}</Text>
      <Text>Has rule: {item.has_rule ? 'Yes' : 'No'}</Text>
      {item.rule && (
        <View style={{ marginLeft: 10 }}>
          <Text>Rule sender: {item.rule.sender}</Text>
          <Text>Rule domain: {item.rule.domain}</Text>
          <Text>Rule subject: {item.rule.subject}</Text>
          <Text>Rule subject regex: {item.rule.subject_regex}</Text>
        </View>
      )}
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