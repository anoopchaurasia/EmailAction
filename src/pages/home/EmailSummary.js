import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MessageService from "../../realm/EmailMessageService";
import MessageEvent from "../../event/MessageEvent";
import MyText from './../component/MyText';

export default function EmailSummary({ navigation }) {
    const [count, setCount] = useState(null);
    const colors = useTheme().colors;

    const fetchCount = async () => {
        try {
            const c = await MessageService.getCount();
            setCount(c);
        } catch (e) {
            console.error("Error fetching email count", e);
        }
    };

    useEffect(() => {
        const rm1 = MessageEvent.onNativeEvent(MessageEvent.NEW_MESSAGE_ARRIVED, (message_count) => {
            if (message_count) {
                setCount(prev => prev + message_count * 1);
            }
        });

        const rm2 = MessageEvent.onNativeEvent(MessageEvent.NEW_MESSAGE_BATCH_ADDED, () => {
            fetchCount();
        });

        fetchCount();

        return () => {
            rm1();
            rm2();
        };
    }, []);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("EmailListByEmail")}
            style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card, shadowColor: colors.text }]}
        >
            <View style={styles.header}>
                <Icon name="email-outline" size={28} color={colors.primary} />
                <MyText style={[styles.title, { color: colors.text }]}>Total Emails</MyText>
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
        elevation: 3
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
