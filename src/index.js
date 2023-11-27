/**
 * Sample React Native App
 * https:
 *
 * @format
 * @flow strict-local
 */

import React, { Node, useState, useEffect } from 'react';
import {
    LogBox
} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginView from './google/LoginView'
import EmailList from './google/EmailList';
import LogoutView from './google/LogoutView';

import SubjectView from './pages/filter/SubjectView';

import QueryListView from './pages/query/QueryListView';
import AttachementView from './pages/query/EmailListView'

import ActivityView from './pages/activity/ActivityView';
import Home from './pages/home/HomeView';

import EmailView from './pages/email/EmailView';
import EmailListView from './pages/email/EmailListView';

import EmailListBySender from './pages/list/EmailListBySender';
import EmailListByDomain from './pages/list/EmailListByDomain';
import EmailListByEmail from './pages/list/EmailListByEmail';


import CreateRuleView from './pages/component/CreateRuleView'


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
    'Non-serializable values were found in the navigation state',
]);

const App: () => Node = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const DrawerNavigation = () => {
        return <Drawer.Navigator screenOptions={{ headerShown: true }} drawerContent={(props) => <LogoutView {...props} onLogoutSuccess={x => setIsAuthenticated(false)} />} >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Domain" component={EmailListByDomain} />
            <Drawer.Screen name="Sender" component={EmailListBySender} />
            <Drawer.Screen name="Email" component={EmailListByEmail} />
            <Drawer.Screen name="QueryListView" component={QueryListView} />
            <Drawer.Screen name="EmailList" component={EmailList} />
            <Drawer.Screen name="ActivityView" component={ActivityView} />
        </Drawer.Navigator>
    };


    return <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <>
                    <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
                    <Stack.Screen name="AttachementView" component={AttachementView} />
                    <Stack.Screen name="EmailListView" component={EmailListView} />
                    <Stack.Screen name="SubjectView" component={SubjectView} />
                    <Stack.Screen name="LoginView" component={LoginView} />
                    <Stack.Screen name="CreateRuleView" component={CreateRuleView} />
                    <Stack.Screen name="EmailView" component={EmailView} />
                </>
            ) : (
                <Stack.Screen
                    name="Login"
                    options={{ headerShown: false }}
                >
                    {(props) => <LoginView {...props} onLoginSuccess={x => setIsAuthenticated(true)} />}
                </Stack.Screen>
            )}
        </Stack.Navigator>
    </NavigationContainer >

};

export default App;
