import React, { useEffect } from 'react';

const MyComponent = () => {
  useEffect(() => {
    // Load the gapi.client object after Google Sign-In is initialized
    GoogleSignin.configure({
      // Add your client ID here
      webClientId: 'your-web-client-id',
    }).then(() => {
      const auth = google.auth;
      const client = google.client;
      auth
        .getClient({
          // Set the API scope you want to use
          scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
        })
        .then(() => {
          client.load('gmail', 'v1', () => {
            console.log('gapi.client loaded');
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, []);

  // Add your code to retrieve the message list here
};




// Load the Gmail API client library
gapi.load('client', function() {
    gapi.client.load('gmail', 'v1', function() {
  
      // Set up the initial request to retrieve the first page of messages
      var request = gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'q': 'is:unread', // To retrieve only unread messages
        'maxResults': 10 // Set the number of messages to retrieve per page
      });
  
      // Execute the initial request
      request.execute(function(response) {
        var messages = response.messages;
        console.log('Page 1:');
        console.log('Total messages: ' + messages.length);
        for (var i = 0; i < messages.length; i++) {
          console.log('Message ID: ' + messages[i].id);
        }
  
        // Set up the request to retrieve the next page of messages (if any)
        var nextPageToken = response.nextPageToken;
        if (nextPageToken) {
          var nextRequest = gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'q': 'is:unread',
            'maxResults': 10,
            'pageToken': nextPageToken
          });
  
          // Execute the next request
          nextRequest.execute(function(nextResponse) {
            var nextMessages = nextResponse.messages;
            console.log('Page 2:');
            console.log('Total messages: ' + nextMessages.length);
            for (var j = 0; j < nextMessages.length; j++) {
              console.log('Message ID: ' + nextMessages[j].id);
            }
          });
        }
      });
    });
  });
  