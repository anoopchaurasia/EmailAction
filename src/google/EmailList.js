import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import MessageService from '../realm/EmailMessageService';
import MessageAggregateService from '../realm/EmailAggregateService';
import DataSync from './../data/DataSync';
import Activity from '../data/ActivityProcess';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import AggregateData from '../data/AggregateData';

const EmailList = () => {
  let [count, setCount] = useState(MessageService.readAll().length);
  let [saveCount, setSavedCount] = useState(0);
  function update(a,b,c) {
    console.log("EmailList",a,b,c);
  }
  ReactNativeForegroundService.add_task((a,b,c) => update(a,b,c), {
    delay: 7000,
    onLoop: true,
    taskId: "taskid",
    onError: (e) => console.error("EmailList", `Error logging:`, e),
  });

  const getList = async (query, pageToken = null) => {
    ReactNativeForegroundService.start({
      id: 1244,
      title: "Foreground Service",
      message: "We are live World",
      icon: "ic_launcher",
      button: true,
      button2: true,
      buttonText: "Button",
      button2Text: "Anther Button",
      buttonOnPress: "cray",
      setOnlyAlertOnce: true,
      color: "#000000",
      progress: {
        max: 100,
        curr: 10,
      },
    });
      DataSync.resumeSync(Activity.aggregate, (c, cc) => {
        setCount(t => t + c);
        setSavedCount(t => t + cc);
        ReactNativeForegroundService.update({progress:{max: 100, curr: 40}})
      });

  };
  
  async function aggregate() {

    console.log("EmailList", "aggregation started", MessageService.readAll().length);
    let messages = MessageService.getCountBySender();
    MessageAggregateService.deleteAll()
    AggregateData.aggregate(messages);
    // senders = senders.map(sender => {
    //   let labels = [];
    //   for (let k in sender.labels) {
    //     labels.push({
    //       count: sender.labels[k],
    //       id: k,
    //       name: k
    //     })
    //   }
    //   return {
    //     ...sender,
    //     labels: labels
    //   }
    // });
    // console.log("data ready", senders.length);
    // senders.forEach(x => MessageAggregateService.create(x));
    // console.log("completed");
  }

  async function syncLabel() {
    console.log("EmailList", 'sync label ')
    DataSync.getLabels(true);
  }

  return (
    <View>
      <Text>{count}/ {saveCount}</Text>
      <Button title="Get List" onPress={async x => { getList(undefined); }} />
      <Button title="Aggregate" onPress={async x => { aggregate(); }} />
      <Button title="Sync Label" onPress={async x => { syncLabel(); }} />
    </View>
  )

};

export default EmailList;
