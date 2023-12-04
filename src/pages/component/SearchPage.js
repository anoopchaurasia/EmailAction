
import React from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // You need to install this library for icons

export default function Checkbox({name, placeholder, onChangeText, value}) {
    return (<View style={{ flexDirection: "row", height: 40, width: "100%", borderColor: '#ccc', borderWidth: .2, }}>

        <Icon name={name} size={30} style={{ marginTop: 5 }} />
        <TextInput
            style={{ height: 40, flex: 1 }}
            onChangeText={onChangeText}
            placeholder={placeholder}
            value={value}
        />
    </View>
    )
}