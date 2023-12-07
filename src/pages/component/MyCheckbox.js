import React from 'react';
import {TouchableHighlight, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // You need to install this library for icons


export default function MyCheckbox({onPress, selected}) {
    return (
        <TouchableHighlight style={{ width: 45, paddingHorizontal: 0, paddingHorizontal: 10}} onPress={onPress}>
        <Icon name="check-circle" size={25} style={{marginTop: 10, marginLeft: 0}}  color={selected? "green": "#ccc"} /> 
    </TouchableHighlight>
    )
}