import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTheme } from '@react-navigation/native';

import ActivityService from '../../realm/ActivityService'
import DomainSummary from "./DomainSummary";
import SenderSummary from "./SenderSummary";
import EmailSummary from './EmailSummary';
import QueriesSummary from "./QueriesSummary";
import TaskSummary from './TaskSummary';

export default function Home({navigation}) {
    
    const colors = useTheme().colors;
    return (
        <View style={{backgroundColor: colors.background}}>
            <DomainSummary navigation={navigation} />
            <SenderSummary navigation={navigation} />
            <EmailSummary navigation={navigation} />
            <QueriesSummary navigation={navigation} />
            <TaskSummary navigation={navigation} />
        </View>
    )
}