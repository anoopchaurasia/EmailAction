import React from 'react';
import { View} from 'react-native';

import KeepAwake from 'react-native-keep-awake'
//import BG from './src/bg_service';
import StartView from './src';
const MyComponent = () => {

  return (
    <>
      <StartView />
      <KeepAwake />
    </>
  );
};


export default MyComponent;