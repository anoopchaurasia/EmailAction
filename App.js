import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import LoginView from './src/google/Login'
import EmailList from './src/google/EmailList';
import ListView from './src/pages/List';

const MyComponent = () => {



 

  return (
    <View>
      <LoginView />
      <EmailList />
      <ListView/>
    </View>
  );
};


export default MyComponent;