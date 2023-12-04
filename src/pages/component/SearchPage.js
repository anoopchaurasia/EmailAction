
import React from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // You need to install this library for icons
import { useTheme } from '@react-navigation/native';

export default function Checkbox({name, placeholder, onChangeText, value}) {
    let theme = useTheme();
    let colors = theme.colors;
    return (<View style={{ flexDirection: "row", height: 40, width: "100%", borderColor: colors.border, borderWidth: .2, marginHorizontal: 10}}>

        <Icon name={name} size={30} style={{ marginTop: 5, color: theme.dark ? "#eee" : "#333" }}  />
        <TextInput
            style={{ height: 40, flex: 1 }}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor = {theme.dark ? "#eee" : "#333"}
            value={value}
        />
    </View>
    )
}