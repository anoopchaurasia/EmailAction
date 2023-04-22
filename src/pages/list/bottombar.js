import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // You need to install this library for icons

const BottomBar = ({onDelete, onTrash, onMove}) => {

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 50, backgroundColor: '#f0f0f0' }}>
      <TouchableOpacity onPress={onDelete} style={{ alignItems: 'center' }}>
        <Icon name="trash" size={25} color="red" />
        <Text style={{ color: 'red' }}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onTrash} style={{ alignItems: 'center' }}>
        <Icon name="trash-o" size={25} color="gray" />
        <Text style={{ color: 'gray' }}>Trash</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onMove} style={{ alignItems: 'center' }}>
        <Icon name="arrows" size={25} color="green" />
        <Text style={{ color: 'green' }}>Move</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;