import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import MessageService from '../realm/EmailMeta';
const multipart = require('parse-multipart-data');
const MyComponent = () => {

  const getList = async (nextPageToken) => {

    console.log(nextPageToken, "ddfdfdfdf");
    // // Build the API endpoint URL with the query parameters
    let apiUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?${new URLSearchParams({
      maxResults: 99,
      pageToken: nextPageToken || "",
    })}`;

    console.log(apiUrl);

    try {
      await GoogleSignin.signInSilently();
      let accessToken = await GoogleSignin.getTokens();
      // GoogleSignin.clearCachedAccessToken(accessToken.accessToken);
      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${accessToken.accessToken}`, 'Content-Type': 'application/json' },
      });
      const messages = await response.json();
      fetchMessageMeta(messages.messages.map(x => x.id), messages.nextPageToken)
    } catch (e) {
      console.error(e, "error");
    }
  };

  const fetchMessageMeta = async (messageIds, nextPageToken) => {


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
    });

    if (!response.ok) {
      throw new Error('Unable to fetch email metadata.');
    }
    const contentType = response.headers.get('Content-Type');
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
      parsedResponses.filter(x => x).map(x => JSON.parse(x)).map(x => {
        try {
          let headers = {};
          x.payload.headers.forEach(r => {
            headers[r.name.toLowerCase()] = r.value;
          });
          let from = headers.from.split(/<|>/)
          console.log(from);
          let sender = from.length === 1 ? from : from[1].trim();
          return { message_id: x.id, created_at: new Date, subject: headers.subject, date: new Date(headers.date), sender: sender, sender_domain: sender.split("@")[1] };
        } catch (e) {
          console.error(e);
          return {}
        }

      }).forEach(x => MessageService.create(x))

      getList(nextPageToken);
      console.log(parsedResponses.length, "parsedResponses")
      // Do something with parsedResponses
    } else {
      // The response is not a multipart response, you can parse it as JSON or whatever format it is in.
      const data = await response.json();
      // Do something with data
    }
  }

  return (
    <View>
      <Button title="Get List" onPress={x => getList()} />
    </View>
  )

  // Add your code to retrieve the message list here
};

export default MyComponent;


