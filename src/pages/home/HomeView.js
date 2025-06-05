import { ScrollView, View, StyleSheet } from "react-native";
import { useTheme } from '@react-navigation/native';

import DomainSummary from "./DomainSummary";
import SenderSummary from "./SenderSummary";
import EmailSummary from './EmailSummary';
import QueriesSummary from "./QueriesSummary";
import TaskSummary from './TaskSummary';

export default function Home({ navigation }) {
    const { colors } = useTheme();

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.container}>
                <DomainSummary navigation={navigation} />
                <SenderSummary navigation={navigation} />
                <EmailSummary navigation={navigation} />
                 <QueriesSummary navigation={navigation} />
                <TaskSummary navigation={navigation} /> 
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 12,
    }
});
