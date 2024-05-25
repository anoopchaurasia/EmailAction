export default class Email  {
    static formatBody = async (result) => {
        return result.filter(x => x.body).map(({ body }) => {
          let string = "";
          let headers = {};
          try {
            //if(body.error && body.error) throw new Error("failed to load data")
            body.payload.headers.forEach(r => {
              headers[r.name.toLowerCase()] = r.value;
            });
            string += "Header";
            let from = (headers.from || "aaa@erer.com").split(/<|>/);
            string += "Headefrom";
            let date = new Date(headers.date);
            string += "new date";
            if (date + "" == "Invalid Date") {
              string += "invalid";
              date = Date.parseString(headers.date)
              string += "invalid+1";
              if (date + "" == "Invalid Date") {
                console.error(headers.date, "invalid date")
                return {};
              }
            }
            string += "date";
            if (body.labelIds && body.labelIds.includes("CHAT")) {
              return {};
            }
            string += "chat";
            let attachments = body.payload.parts && (body.payload.parts).filter(x => x.body?.attachmentId).map(x => {
              return { name: x.filename, id: x.body.attachmentId, size: x.body.size }
            });
            string += "attachment";
            let sender_name = from.length === 1 ? from[0] : from[0].trim();
            let sender = from.length === 1 ? from[0] : from[1].trim();
            let r = { labels: body.labelIds || [], sender_name, message_id: body.id, created_at: new Date, subject: headers.subject || "", date: date, sender: sender, sender_domain: sender.split("@")[1] };
            attachments && (r.attachments = attachments);
            string += "r";
            return r;
          } catch (e) {
            console.error("extraction", string , e, body);
            return {}
          }
        }).filter(x => x.message_id)
      }

      static format = async (result) => {
        return this.formatBody(result);
      }
}