import Utility from "../utility/Utility";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Email from "../email/Email";

const base_gmail_url = "https://gmail.googleapis.com/gmail/v1/users/me/"
export default class Gmail extends Email{
  static gmailFetch = async function (url, options) {
    console.log(url);
    let accessToken = (await GoogleSignin.getTokens()).accessToken;
    options.headers.Authorization = `Bearer ${accessToken}`
    try {
        return fetch(url, options).then(async x => {
          if (x.status == '401') {
            await GoogleSignin.clearCachedAccessToken(accessToken);
            console.log(x, x.status, "re trying");
            return Gmail.gmailFetch(url, options);
          }
          if(x.status!==200) {
            console.log(x, x.status, "re trying");
          } else {
            console.log("got response");
          }
          return x;
        });
    } catch(e) {
      console.error(e, "failed to fetch");
      throw new Error(e);
    }
  }

  static getMessageIds = async (query, nextPageToken) => {

    let apiUrl = `${base_gmail_url}messages?${new URLSearchParams({
      maxResults: 100,
      q: query || "",
      pageToken: nextPageToken || "",
    })}`;
    console.log(apiUrl);
    let response = await Gmail.gmailFetch(apiUrl, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status != 200) {
      throw Error(await response.text());
    }
    response = await response.json();
    return { message_ids: (response.messages || []).map(x => x.id), nextPageToken: response.nextPageToken }
  }

  static fetchAttachment = async (messageId, attachmentID) => {
    let path = `${base_gmail_url}messages/${messageId}/attachments/${attachmentID}`;
    let response = await Gmail.gmailFetch(path, {
      headers: {},
    });
    if (response.status != 200) {
      throw Error(await response.text());
    }
    let res = await response.json();
    return res.data.replace(/\-/g, '+').replace(/_/g, '/') + '=='.substring(0, (3 * res.data.length) % 4);
  }

  static getLabels = async () => {
    let url = `${base_gmail_url}labels`;
    let response = await Gmail.gmailFetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status != 200) {
      throw Error(await response.text());
    }

    let { labels } = await response.json();
    return labels;
  }

  static createBatchRequest = async (message_ids, params, method = "GET", body) => {
    return message_ids.map((messageId) => {
      return {
        method: method,
        headers: {
          "Accept-Type": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
        path: `${base_gmail_url}messages/${messageId}${params}`,
      };
    });
  }

  static getMessagebById = async (messageId) => {
    let url = `${base_gmail_url}messages/${messageId}`;
    let response = await Gmail.gmailFetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status != 200) { 
      throw Error(await response.text());
    }
    let { payload } = await response.json();
    return payload;
  }


  static callBatch = async (body) => {
    let boundary = 'batch_request';
    const base_url = 'https://gmail.googleapis.com/batch';
    return Utility.multipart(await Gmail.gmailFetch(base_url, {
      method: 'POST',
      headers: {

        'Content-Type': `multipart/mixed; boundary=${boundary}`,
        "Accept-Type": "application/json"
      },
      body: body
        .map((request) => {
          let body = `--${boundary}\r\n`;
          body += `Content-Type: application/http\r\n\r\n`;
          body += `${request.method} ${request.path}\r\n`;
          for (var header in request.headers) {
            body += `${header}: ${request.headers[header]}\r\n`;
          }
          if (request.method.toLowerCase() == "post") body += `\r\n${request.body}\r\n`;
          return body;
        })
        .join('') + '--batch_request--',
    }));
  }

  

  static getTotal = async () => {
    return Gmail.gmailFetch(`${base_gmail_url}profile`, {
      headers: {

        "Accept-Type": "application/json"
      },
    }).then(async x => await x.json());
  }

  static createLabel = async (name) => {
    const label = {
      name: name,
      labelListVisibility: 'labelShow',
    };
    return Gmail.gmailFetch(
      `${base_gmail_url}labels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify(label),
    });
  }
}