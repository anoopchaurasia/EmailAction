import Utility from "../utility/Utility";
export default class Gmail {

  static getMessageIds = async (accessToken, query, nextPageToken) => {

    let apiUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?${new URLSearchParams({
      maxResults: 10,
      q: query || "",
      pageToken: nextPageToken || "",
    })}`;
    let response = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });
    if (response.status != 200) {
      throw Error(await response.text());
    }
    response = await response.json();
    return { message_ids: (response.messages || []).map(x => x.id), nextPageToken: response.nextPageToken }
  }

  static fetchAttachment = async (messageId, attachmentID, accessToken) => {
    let path = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentID}`;
    console.log(path);
    let response = await fetch(path, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (response.status != 200) {
      throw Error(await response.text());
    }
    let res = await response.json();
    return res.data.replace(/\-/g, '+').replace(/_/g, '/') + '=='.substring(0, (3 * res.data.length) % 4);
  }

  static getLabels = async (accessToken) => {
    let url = 'https://gmail.googleapis.com/gmail/v1/users/me/labels';
    let response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
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
        path: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}${params}`,
      };
    });
  }

  static callBatch = async (body, accessToken) => {
    let boundary = 'batch_request';
    const base_url = 'https://gmail.googleapis.com/batch';
    return Utility.multipart(await fetch(base_url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

  static formatBody = async (result) => {
    return result.filter(x => x.body).map(({ body }) => {
      let headers = {};
      try {
        //if(body.error && body.error) throw new Error("failed to load data")
        body.payload.headers.forEach(r => {
          headers[r.name.toLowerCase()] = r.value;
        });
        let from = (headers.from || "aaa@erer.com").split(/<|>/)
        let date = new Date(headers.date);
        if (date + "" == "Invalid Date") {
          date = Date.parseString(headers.date)
          if (date + "" == "Invalid Date") {
            console.error(headers.date, "invalid date")
            return {};
          }
        }
        // let attachments = body.payload.parts && (body.payload.parts).filter(x => x.body?.attachmentId).map(x => {
        //   return { name: x.filename, id: x.body.attachmentId, size: x.body.size }
        // });
        let sender = from.length === 1 ? from[0] : from[1].trim();
        return {  labels: body.labelIds, message_id: body.id, created_at: new Date, subject: headers.subject || "", date: date, sender: sender, sender_domain: sender.split("@")[1] };
      } catch (e) {
        console.error("extraction", e, body);
        return {}
      }
    }).filter(x => x.message_id)
  }

  static format = async (result) => {
    return this.formatBody(result);
  }


}