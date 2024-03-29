import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // You need to install this library for icons
import MyText from './MyText'

const BottomBar = ({list, visible=true, style={}, disabled=false}) => {
  if(!visible) {
    return null;
  }
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 50, backgroundColor: style.backgroundColor || '#f0f0f0' }}>
      
      {list.map(x=>(<TouchableOpacity key={x.name} onPress={x.action} style={{ alignItems: 'center' }}>
        <Icon disabled={disabled} name={x.icon} size={25} color="red" />
        <MyText disabled={disabled} style={{ color: 'red' }}>{x.name}</MyText>
      </TouchableOpacity>))}
     
    </View>
  );
};

export default BottomBar;