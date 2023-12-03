/**
 * Sample React Native App
 * https:
 *
 * @format
 * @flow strict-local
 */

import React, { Node, useState, useEffect } from 'react';
import {
    LogBox, Text, View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


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

const LogoTitle = ({name, title}) => {
    return <View style={{fontSize: 40, flexDirection:"row", alignItems:"center", alignContent:"center"}}>
        <Icon size={20} name={name} style={{marginTop:3}} /> 
        <Text style={{fontSize: 20, marginLeft: 5}}>{title}</Text>
    </View>
}

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const App: () => Node = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const DrawerNavigation = () => {
        return <Drawer.Navigator screenOptions={{ headerShown: true }} drawerContent={(props) => <LogoutView {...props}  onLogoutSuccess={x => setIsAuthenticated(false)} />} >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Domain" component={EmailListByDomain} options={{ headerTitle:(props)=>  <LogoTitle title="Sender Domain" name="domain" />, title: (props) => <LogoTitle title="Sender Domain" name="domain" /> }}/>
            <Drawer.Screen name="Sender" component={EmailListBySender} options={{ headerTitle:(props)=>  <LogoTitle title="Sender" name="call-received" />, title: (props) => <LogoTitle title="Sender" name="call-received" /> }}/>
            <Drawer.Screen name="Email" component={EmailListByEmail} options={{ headerTitle:(props)=>  <LogoTitle title="Email" name="at" />, title: (props) => <LogoTitle title="Email" name="at" /> }}/>
            <Drawer.Screen name="QueryListView" component={QueryListView} options={{ headerTitle:(props)=>  <LogoTitle title="Saved Queries" name="database-search" />, title: (props) => <LogoTitle title="Saved Queries" name="database-search" /> }}/>
            <Drawer.Screen name="ActivityView" component={ActivityView} options={{ headerTitle:(props)=>  <LogoTitle title="Saved Rules" name="gate-xor" />, title: (props) => <LogoTitle title="Saved Rules" name="gate-xor" /> }}/>
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
