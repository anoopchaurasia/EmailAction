import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import MessageAggregateService from '../realm/EmailAggregateService';
import ActivityMethods from '../realm/ActivityService';
import LabelService from '../realm/LabelService';
import QueryService from '../realm/QueryMessageService';
import EmailMessageService from './../realm/EmailMessageService';
import Utility from '../utility/Utility';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import MessageEvent from '../event/MessageEvent';


const DrawerContent = (props) => {
  const {onLogoutSuccess } = props;

  const handleSignOut = async () => {
    try {
      MessageAggregateService.deleteAll();
      ActivityMethods.deleteAll();
      LabelService.deleteAll();
      QueryService.deleteAll();
      EmailMessageService.deleteAll();
      MessageEvent.emit('user_logged_out');
      Utility.clear();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      onLogoutSuccess();
    } catch (error) {
      console.log(error.message, "logout");
    }
  };
  
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View>
          {/* Drawer items */}
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Sign Out button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  signOutButton: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 15,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white', // Add background color for better visibility
  },
  signOutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default DrawerContent;
