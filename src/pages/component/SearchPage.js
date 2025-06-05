import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@react-navigation/native';
import { Button } from 'react-native-paper';

export default function SearchBar({ name = "magnify", placeholder, onChangeText }) {
    const theme = useTheme();
    const colors = theme.colors;
    const [value, setValue] = React.useState('');

    return (
        <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Icon name={name} size={24} color={colors.text} style={styles.icon} />
            <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={placeholder}
                placeholderTextColor={theme.dark ? "#aaa" : "#666"}
                value={value}
                onChangeText={setValue}
                returnKeyType="search"
                onSubmitEditing={() => onChangeText(value)}
            />
            <Button
                mode="contained"
                onPress={() => onChangeText(value)}
                style={styles.button}
                contentStyle={{ height: 40 }}
                labelStyle={{ fontSize: 14 }}
            >
                Search
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        paddingHorizontal: 10,
        height: 48,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
    },
    button: {
        marginLeft: 10,
        borderRadius: 8,
    },
});
