import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import MessageService from '../realm/EmailMessage';
import MessageAggregateService from './../realm/EmailAggregate';
import MyDate from '../utility/MyDate';
import DataSync from './../data/DataSync';
import Utility from '../utility/Utility';
const MyComponent = () => {
  let [count, setCount] = useState(MessageService.readAll().length);
  let [saveCount, setSavedCount] = useState(0);


  const getList = async (query, pageToken=null) => {
    try {
      if(pageToken=='done') return console.info("Done getList");
      console.log(query, pageToken);
      let { message_ids, nextPageToken} = await DataSync.getList(query, pageToken);
      console.log(count, message_ids.length );
      setCount(c=> c+message_ids.length);
      message_ids = message_ids.filter(message_id => MessageService.checkMessageId(message_id)==false);
      await Utility.saveData("nextPageToken_list", nextPageToken);
      if(message_ids.length) {
        setSavedCount(c=> c+message_ids.length);
        console.log(message_ids.length, "message_ids.length");
        let messages = await DataSync.fetchMessageMeta(message_ids);
        messages.map(x=> MessageService.update(x));

      }
    } catch (e) {
      console.error(e, "get list");
    } finally {
      setTimeout(async x=>{
        let nextPageToken = await Utility.getData('nextPageToken_list');
        if(nextPageToken=='done') aggregate();
        nextPageToken && nextPageToken!='done' && getList(query, nextPageToken);
      }, 500);

    }
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
      <Button title="Get List" onPress={async x => { getList(undefined,await Utility.getData('nextPageToken_list')); }} />
      <Button title="Aggregate" onPress={async x => { aggregate(); }} />
    </View>
  )

};

export default MyComponent;
