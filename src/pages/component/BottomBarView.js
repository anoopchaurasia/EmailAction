import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // You need to install this library for icons

const BottomBar = ({list, visible}) => {
  if(!visible) {
    return null;
  }
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 50, backgroundColor: '#f0f0f0' }}>
      
      {list.map(x=>(<TouchableOpacity key={x.name} onPress={x.action} style={{ alignItems: 'center' }}>
        <Icon name={x.icon} size={25} color="red" />
        <Text style={{ color: 'red' }}>{x.name}</Text>
      </TouchableOpacity>))}
     
    </View>
  );
};

export default BottomBar;