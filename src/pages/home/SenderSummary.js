import { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MessageAggregateService from './../../realm/EmailAggregateService';
import MessageEvent from "../../event/MessageEvent";
import MyText from './../component/MyText';

export default function SenderSummary({ navigation }) {
    const colors = useTheme().colors;
    const [count, setCount] = useState(null);

    const fetchCount = async () => {
        try {
            const c = await MessageAggregateService.count();
            setCount(c);
        } catch (err) {
            console.error("Failed to fetch sender count", err);
            setCount(0);
        }
    };

    useEffect(() => {
        const rm2 = MessageEvent.onNativeEvent(MessageEvent.NEW_MESSAGE_BATCH_ADDED, () => {
            fetchCount();
        });

        fetchCount();

        return () => {
            rm2();
        };
    }, []);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Sender")}
            style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card, shadowColor: colors.text }]}
        >
            <View style={styles.header}>
                <Icon name="account-multiple-outline" size={28} color={colors.primary} />
                <MyText style={[styles.title, { color: colors.text }]}>Total Senders</MyText>
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
