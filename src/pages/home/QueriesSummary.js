import { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import QueryService from "../../realm/QueryMessageService";
import MyText from './../component/MyText';

export default function QueriesSummary({ navigation }) {
    const [count, setCount] = useState(null);
    const colors = useTheme().colors;

    useEffect(() => {
        QueryService.getAll()
            .then(results => setCount(results.length))
            .catch(err => {
                console.error("Failed to fetch queries", err);
                setCount(0);
            });
    }, []);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("QueryListView")}
            style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card, shadowColor: colors.text }]}
        >
            <View style={styles.header}>
                <Icon name="magnify" size={28} color={colors.primary} />
                <MyText style={[styles.title, { color: colors.text }]}>Total Queries</MyText>
            </View>
            {count === null ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
                <MyText style={[styles.count, { color: colors.text }]}>{count}</MyText>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginVertical: 8,
        alignItems: "center",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
    },
    count: {
        fontSize: 36,
        fontWeight: "bold",
    },
});
