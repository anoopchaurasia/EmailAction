import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import MyDate from '../utility/MyDate';
import DataSync from './../data/DataSync';
const MyComponent = () => {
  let [count, setCount] = useState(0);

  const getList = async (query) => {
      DataSync.getList(query);
  };

  return (
    <View>
      <Text>{count}</Text>
      <Button title="Get List" onPress={x => { getLabels(); }} />
    </View>
  )

};

export default MyComponent;
