import { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MyText from './../component/MyText';
import ActivityService from './../../realm/ActivityService';
import MessageEvent from "../../event/MessageEvent";

export default function TaskSummary({ navigation }) {
    const colors = useTheme().colors;
    const [taskProcessStatus, setTaskProcessStatus] = useState("");
    const [totalActivity, setTotalActivity] = useState(null);

    const fetchTotalActivity = async () => {
        try {
            const activities = await ActivityService.getAll();
            setTotalActivity(activities.length);
        } catch (err) {
            console.error("Failed to fetch activities", err);
            setTotalActivity(0);
        }
    };

    useEffect(() => {
        fetchTotalActivity();

        const rm2 = MessageEvent.onNativeEvent(MessageEvent.NEW_EMAIL_RULE_CREATED, fetchTotalActivity);
        const rm3 = MessageEvent.onNativeEvent(MessageEvent.EMAIL_RULE_DELETED, fetchTotalActivity);

        return () => {
            rm2();
            rm3();
        };
    }, []);

    useEffect(() => {
        // Enable when task progress tracking is implemented
        // return MessageEvent.on('taskinprogress', handleEvent);
    }, []);

    function handleEvent(e) {
        if (!e?.task) return;

        const sender = e.task.from?.toString() || "unknown";
        const label = e.task.to_label || "unknown";

        switch (e.status) {
            case 'starting':
            case 'processing':
            case 'processed':
                setTaskProcessStatus(
                    `Processing task for sender ${sender} → ${label}${e.count ? `: ${e.count}` : ""}`
                );
                break;
        }
    }

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("ActivityView")}
            style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card, shadowColor: colors.text }]}
        >
            <View style={styles.header}>
                <Icon name="briefcase-check-outline" size={28} color={colors.primary} />
                <MyText style={[styles.title, { color: colors.text }]}>Total Rules</MyText>
            </View>

            {totalActivity === null ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
                <MyText style={[styles.count, { color: colors.text }]}>{totalActivity}</MyText>
            )}

            {taskProcessStatus ? (
                <MyText style={[styles.status, { color: colors.text }]}>{taskProcessStatus}</MyText>
            ) : null}
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
    status: {
        fontSize: 14,
        marginTop: 10,
        textAlign: "center",
    },
});
