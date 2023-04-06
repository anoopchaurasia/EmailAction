export default class Gmail {

    static getMessageIds = async(accessToken, nextPageToken) =>{

          let apiUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?${new URLSearchParams({
            maxResults: 10,
            pageToken: nextPageToken || "",
          })}`;
      
      
          try {
            let response = await fetch(apiUrl, {
              headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            });
            if(response.status != 200) {
                throw Error(response);
            }
            response = await response.json();
            return {message_ids: response.messages.map(x => x.id), nextPageToken: response.nextPageToken}
            
          } catch (e) {
            console.error(e, "Gmail.getMessageId");
          }
    }

    static createBatchRequest = async(message_ids) => {
        return message_ids.map((messageId) => {
            return {
              id: messageId,
              method: 'GET',
              headers: {
                "Accept-Type": "application/json"
              },
              path: `/gmail/v1/users/me/messages/${messageId}?format=metadata&metadataHeaders=Subject&metadataHeaders=from&metadataHeaders=to&metadataHeaders=date&metadataHeaders=lebelIds&metadataHeaders=snippet`,
            };
          });
    }

    static callBatch = async(url, body, accessToken) =>{
       return this.extractresponse(await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/mixed; boundary=batch_request',
              "Accept-Type": "application/json"
            },
            body: body
            .map((request) => {
                return `--batch_request\nContent-Type: application/http\nContent-ID: ${request.id}\n\n${request.method} ${request.path} HTTP/1.1\nAuthorization: Bearer ${accessToken}\n\n`;
            })
              .join('') + '--batch_request--',
          }));
      
    }

    // static extractresponse = (response) {
    //     if (!response.ok) {
    //         throw new Error('Unable to fetch email metadata.');
    //       }
    //       const contentType = response.headers.get('Content-Type');
    //     if (contentType.includes('multipart/mixed')) {
    //         const boundary = contentType.split(';')[1].split('=')[1];
    //         const rawResponse = await response.text();
      
    //         const responses = rawResponse.split(`--${boundary}`);
    //         const parsedResponses = responses.filter(r => r && r.trim() !== '').map(r => {
    //           // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    //           const parts = r.split('\r\n\r\n');
    //           const headers = parts[0].split('\r\n');
    //           //  console.log(parts[2])
    //           return parts[2];
      
    //         });
    //         let length = parsedResponses.filter(x => x).map(x => JSON.parse(x)).map(x => {
    //           let headers = {};
    //           try {
    //             x.payload.headers.forEach(r => {
    //               headers[r.name.toLowerCase()] = r.value;
    //             });
    //             let from = (headers.from || "aaa@erer.com").split(/<|>/)
    //             let date = new Date(headers.date);
    //             if (date + "" == "Invalid Date") {
    //               date = Date.parseString(headers.date)
    //               if (date + "" == "Invalid Date") {
    //                 console.error(headers.date, "invalid date")
    //               }
    //             }
    //             let sender = from.length === 1 ? from[0] : from[1].trim();
    //             return { message_id: x.id, created_at: new Date, subject: headers.subject || "", date: date, sender: sender, sender_domain: sender.split("@")[1] };
    //           } catch (e) {
    //             console.error("extraction", e, x);
    //             return {}
    //           }
      
    //         }).map(x => MessageService.create(x)).length;
    //         setCount(x => { return x + length });
    //         saveData('pageToken', nextPageToken);
    //           getList(nextPageToken);
    //         // Do something with parsedResponses
    //       } else {
    //         // The response is not a multipart response, you can parse it as JSON or whatever format it is in.
    //         const data = await response.json();
    //         // Do something with data
    //       }
    
}