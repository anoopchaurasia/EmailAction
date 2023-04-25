import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import MessageService from '../realm/EmailMessage';
import MyDate from '../utility/MyDate';
import DataSync from './../data/DataSync';
const MyComponent = () => {
  let [count, setCount] = useState(0);

  const getList = async (query, pageToken=null) => {
      let { message_ids, nextPageToken} = await DataSync.getList(query, pageToken);
      let messages = await DataSync.fetchMessageMeta(message_ids);
      messages.map(x=> MessageService.update(x));
      setTimeout(x=>{

        getList(query, nextPageToken);
      }, 1000);
  };

  return (
    <View>
      <Text>{count}</Text>
      <Button title="Get List" onPress={x => { getList(); }} />
    </View>
  )

};

export default MyComponent;
