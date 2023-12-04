import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import MyText from './component/MyText';
const YourComponent = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const data = [
    { id: 1, title: 'Item 1' },
    { id: 2, title: 'Item 2' },
    { id: 3, title: 'Item 3' },
    // Add more items as needed
  ];

  const handleLongPress = (item) => {
    if (selectedItems.includes(item)) {
      // If the item is already selected, deselect it
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
    } else {
      // If the item is not selected, select it
      setSelectedItems([...selectedItems, item]);
    }
  };

  const hanldePress = (item) => {
    if(selectedItems.length==0) return;
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item.id)}
      onPress={()=> hanldePress(item.id)}
      style={{
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: selectedItems.includes(item.id) ? '#e0e0e0' : 'white',
      }}>
      <MyText>{item.title}</MyText>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default YourComponent;
