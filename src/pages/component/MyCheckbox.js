import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // You need to install this library for icons


export default function MyCheckbox({onPress, selected}) {
    return (
        <View style={{ height:"100%", width: 27}}>
        <Icon name="check-circle" size={25} style={{marginTop: 10, marginLeft: 0}} onPress={onPress} color={selected? "green": "#ccc"} /> 
    </View>
    )
}