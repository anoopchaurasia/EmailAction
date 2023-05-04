export default class Email  {
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
            if (body.labelIds && body.labelIds.includes("CHAT")) {
              return {};
            }
            let attachments = body.payload.parts && (body.payload.parts).filter(x => x.body?.attachmentId).map(x => {
              return { name: x.filename, id: x.body.attachmentId, size: x.body.size }
            });
            let sender_name = from.length === 1 ? from[0] : from[0].trim();
            let sender = from.length === 1 ? from[0] : from[1].trim();
            let r = { labels: body.labelIds || [], sender_name, message_id: body.id, created_at: new Date, subject: headers.subject || "", date: date, sender: sender, sender_domain: sender.split("@")[1] };
            attachments && (r.attachments = attachments);
            return r;
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