/**
 * Sample React Native App
 * https:
 *
 * @format
 * @flow strict-local
 */

import React, { Node } from 'react';
import {
    LogBox
} from 'react-native';

import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginView from './google/LoginView'
import EmailList from './google/EmailList';
import EmailListByDomain from './pages/list/EmailListByDomain';
import EmailList1 from './pages/list/EmailList';
import SubjectView from './pages/filter/SubjectView';
import QueryListView from './pages/query/QueryListView';
import AttachementView from './pages/query/EmailListView'
import EmailListView from './pages/email/EmailListView';
import ActivityView from './pages/activity/ActivityView';
import Home from './pages/home/HomeView';
import BySenderView from './pages/email/EmailView';
import EmailListBySender from './pages/list/EmailListBySender';
import TestView from './pages/test';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'tomato',
        secondary: 'yellow',
    },
};

LogBox.ignoreLogs([
    'Non-serializable valures were found in the navigation state',
]);

const App: () => Node = () => {
    const DrawerNavigation = () => {
        return <Drawer.Navigator  screenOptions={{ headerShown: true }}>
            <Drawer.Screen name="Email" component={EmailList1} />
            <Drawer.Screen name="Sender" component={EmailListBySender} />
            <Drawer.Screen name="Domain" component={EmailListByDomain} />
            <Drawer.Screen name="Test" component={TestView} />
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="QueryListView" component={QueryListView} />
            <Drawer.Screen name="EmailList" component={EmailList} />
            <Drawer.Screen name="ActivityView" component={ActivityView} />
        </Drawer.Navigator>
    };
    
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} /> 
                <Stack.Screen name="AttachementView" component={AttachementView} />
                <Stack.Screen name="Login" component={LoginView} />
                <Stack.Screen name="EmailListView" component={EmailListView} />
                <Stack.Screen name="SubjectView" component={SubjectView} />
            <Stack.Screen name="BySenderView" component={BySenderView} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
