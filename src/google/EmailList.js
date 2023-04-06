import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import MessageService from '../realm/EmailMeta';
import MyDate from './../utility/MyDate';
import Gmail from './gmail';
import multipart  from './multipart'
import Utility from '../utility/Utility';
import { arrayBuffer } from 'stream/consumers';

const MyComponent = () => {
  let [count, setCount] = useState(0);



  const getList = async (nextPageToken) => {

    if (!nextPageToken) {
     // nextPageToken = await getData('pageToken');
      console.log(nextPageToken, "nextPageToken");
    }

    
    try {
      await GoogleSignin.signInSilently();
      let accessToken = await GoogleSignin.getTokens();
      let {message_ids, nextPageToken}= await Gmail.getMessageIds(accessToken.accessToken, nextPageToken).catch(e=>{
        console.error(e, "Gmail.message failed");
      });

      // if (!messages.messages) {
      //   console.log("failed: did not receive message", messages);
      //   return setTimeout(x => getList(messages.nextPageToken || nextPageToken), 10000);
      // }
      console.log( nextPageToken, "dfdfdfdf");
      fetchMessageMeta(message_ids, nextPageToken)
    } catch (e) {
      console.error(e, "error");
    }
  };

  const fetchMessageMeta = async (messageIds, nextPageToken) => {

    //console.log(messageIds, nextPageToken, "messageid")
    const accessToken = (await GoogleSignin.getTokens()).accessToken;
    const url = 'https://gmail.googleapis.com/batch';

    const batchRequests = messageIds.map((messageId) => {
      return {
        id: messageId,
        method: 'GET',
        headers: {
          
          "Accept-Type": "application/json"
        },
        path: `/gmail/v1/users/me/messages/${messageId}?format=metadata&metadataHeaders=Subject&metadataHeaders=from&metadataHeaders=to&metadataHeaders=date&metadataHeaders=lebelIds&metadataHeaders=snippet`,
      };
    });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/mixed; boundary=batch_request',
        "Accept-Type": "application/json"
      },
      body: batchRequests
        .map((request) => {
          return `--batch_request\nContent-Type: application/http\nContent-ID: ${request.id}\n\n${request.method} ${request.path} HTTP/1.1\nAuthorization: Bearer ${accessToken}\n\n`;
        })
        .join('') + '--batch_request--',
    }).catch(e=> console.error(e));

    if (!response.ok) {
      throw new Error('Unable to fetch email metadata.');
    }
    console.log((await Utility.multipart(response)), "dfdf");
    return;

    if (!response.ok) {
      throw new Error('Unable to fetch email metadata.');
    }
   // const contentType = response.headers.get('Content-Type');
    if (contentType.includes('multipart/mixed')) {
      const boundary = contentType.split(';')[1].split('=')[1];
      const rawResponse = await response.text();

      const responses = rawResponse.split(`--${boundary}`);
      const parsedResponses = responses.filter(r => r && r.trim() !== '').map(r => {
        // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        const parts = r.split('\r\n\r\n');
        const headers = parts[0].split('\r\n');
        //  console.log(parts[2])
        return parts[2];

      });
      let length = parsedResponses.filter(x => x).map(x => JSON.parse(x)).map(x => {
        let headers = {};
        try {
          x.payload.headers.forEach(r => {
            headers[r.name.toLowerCase()] = r.value;
          });
          let from = (headers.from || "aaa@erer.com").split(/<|>/)
          let date = new Date(headers.date);
          if (date + "" == "Invalid Date") {
            date = Date.parseString(headers.date)
            if (date + "" == "Invalid Date") {
              console.error(headers.date, "invalid date")
            }
          }
          let sender = from.length === 1 ? from[0] : from[1].trim();
          return { message_id: x.id, created_at: new Date, subject: headers.subject || "", date: date, sender: sender, sender_domain: sender.split("@")[1] };
        } catch (e) {
          console.error("extraction", e, x);
          return {}
        }

      }).map(x => MessageService.create(x)).length;
      setCount(x => { return x + length });
      saveData('pageToken', nextPageToken);
        getList(nextPageToken);
      // Do something with parsedResponses
    } else {
      // The response is not a multipart response, you can parse it as JSON or whatever format it is in.
      const data = await response.json();
      // Do something with data
    }
  }

  return (
    <View>
      <Text>{count}</Text>
      <Button title="Get List" onPress={x => getList()} />
    </View>
  )

  // Add your code to retrieve the message list here
};


async function saveData(key, value) {
  try {
    console.log(value, key);
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('Error saving data:', error);
  }
}

// Get data
async function getData(key) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log('Error retrieving data:', error);
  }
}

export default MyComponent;
