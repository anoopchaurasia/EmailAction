import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import MessageService from '../realm/EmailMessage';
import MessageAggregateService from './../realm/EmailAggregate';
import MyDate from '../utility/MyDate';
import DataSync from './../data/DataSync';
const MyComponent = () => {
  let [count, setCount] = useState(MessageService.readAll().length);
  let [saveCount, setSavedCount] = useState(0);


  const getList = async (query, pageToken=null) => {
    DataSync.getList(query, pageToken, true, (total, filtered_total)=> {
      setCount(c=>c+total);
      setSavedCount(c=>c+filtered_total);
    });
  };

  async function aggregate() {

    console.log("aggregation started", MessageService.readAll().length);
    let senders = MessageService.getCountBySender();
    MessageAggregateService.deleteAll()
    senders = senders.map(sender => {
        let labels = [];
        for (let k in sender.labels) {
            labels.push({
                count: sender.labels[k],
                id: k,
                name: k
            })
        }
        return {
            ...sender,
            labels: labels
        }
    });
    console.log("data ready", senders.length);
    senders.forEach(x => MessageAggregateService.create(x));
    console.log("completed");
}

  return (
    <View>
      <Text>{count}/ {saveCount}</Text>
      <Button title="Get List" onPress={async x => { getList(undefined); }} />
      <Button title="Aggregate" onPress={async x => { aggregate(); }} />
    </View>
  )

};

export default MyComponent;
