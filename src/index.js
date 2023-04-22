/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Node } from 'react';
import {
    LogBox, View, Text, Button
} from 'react-native';

import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';


import ListEmail from './pages/list/List';
import LoginView from './google/login'
import EmailList from './google/emailList';
import ListView from './pages/list/List';
import FilterView from './pages/filter/SubjectView';
import QueryView from './pages/query/QueryView';
import AttachementView from './pages/query/AttachementView'

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

// function ListViewBottomTabNavigator() {
//     return (
//       <Tab.Navigator>
//         <Tab.Screen name="Home" component={ListView} />
//       </Tab.Navigator>
//     );
//   }


LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

{/* <LoginView />
<EmailList />
<ListView/> */}


function CustomDrawerContent(props) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Custom Drawer Content</Text>
        <Button title="Close drawer" onPress={() => props.navigation.closeDrawer()} />
      </View>
    );
  }

const App: () => Node = () => {

    const DrawerNavigation = () => {
        return <Drawer.Navigator  >
            <Drawer.Screen name="AttachementView" component={AttachementView} />
            <Drawer.Screen name="Home" component={ListView} />
            <Drawer.Screen name="EmailList" component={EmailList} />
        </Drawer.Navigator>
    };

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} /> 
                <Stack.Screen name="Login" component={LoginView} />
                {/* <Stack.Screen name="AttachementView" component={AttachementView} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
