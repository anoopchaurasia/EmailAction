import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import LoginView from './src/google/Login'
import EmailList from './src/google/EmailList';
import KeepAwake from 'react-native-keep-awake'
import ListView from './src/pages/List';

const MyComponent = () => {



 

  return (
    <View>
      <LoginView />
      <EmailList />
      <ListView/>
      <KeepAwake />
    </View>
  );
};


export default MyComponent;