import Realm from 'realm';

// Define the Message schema
const MessageSchema = {
    name: 'Message',
    primaryKey: 'message_id',
    properties: {
        message_id: 'string',
        subject: 'string',
        sender_name: {type:'string'},
        sender: {type:'string', indexed: true},
        sender_domain: {type:'string', indexed: true},
        date: {type: 'date', indexed: true},
       // keep: {type:Boolean, indexed:true, },
        created_at: 'date',
        labels: {type:'string[]'},
        attachments: "Attachment[]",
        has_attachement: {type:"bool", default: false, index: true}
    },
};


const AttachmentSchemma = {
    name: 'Attachment',
    properties: {
      id: 'string',
      name: 'string',
      size: 'int'
    }
  };

const migrationFunction = (oldRealm, newRealm) => {
    // Migrate your data here
};

// Create a new Realm instance with the Message schema
const realm = new Realm({
    path:"messagedata",
    schema: [MessageSchema, AttachmentSchemma], schemaVersion: 12, migration: migrationFunction,
});

// Define CRUD methods for Message objects
const MessageService = {
    create: (message) => {
        try{
            realm.write(() => {
                realm.create('Message', message);
            });
        } catch(e) {
            console.error(e, message, "MessageService.create");
        }
    },

    readMessage: () => {
        let messages = realm.objects('Message').sorted('date', true);
        return messages.slice(0, 10);
    },

    readAll: () => {
        return realm.objects('Message').filtered('NOT labels == "TRASH"');
    },

    readById: (id) => {
        return realm.objectForPrimaryKey('Message', id);
    },

    update: (message) => {
        realm.write(() => {
            realm.create('Message', message, true);
        });
    },

    delete: (message) => {
        realm.write(() => {
            realm.delete(message);
        });
    },

    checkMessageId: function (message_id) {
        let message = realm.objectForPrimaryKey('Message', message_id);
        if (message) {
            return true;
        } else {
            return false;
        }
    },

    getCountBySenderDomain: () => {
        const messages = realm.objects('Message').filtered('labels == "INBOX"');
        const countBySenderDomain = messages.reduce((acc, message) => {
            const domain = message.sender_domain;
            if (!acc[domain]) {
                acc[domain] = 0;
            }
            acc[domain]++;
            return acc;
        }, {});
        let d = [];
        for(let k in countBySenderDomain) {
            d.push({v: countBySenderDomain[k], k})
        }
        return d;
    },

    getCountBySender: (sender) => {
        let messages = realm.objects('Message').filtered('labels == "INBOX"');
        if(sender) messages = messages.filtered('sender == $0', sender);
        return messages;
        // let countSender = messages.reduce((acc, message) => {
        //     const sender = message.sender;
        //     if (!acc[sender]) {
        //         acc[sender] = {c: 0, labels: {}};
        //     }
        //     acc[sender].c++;
        //     message.labels.forEach(l=>{
        //         if(!acc[sender].labels[l]) acc[sender].labels[l]=0
        //         acc[sender].labels[l]++;
        //         if(l==="TRASH") acc[sender].c--;
        //     })
        //     return acc;
        // }, {});
        // let d = [];
        // for(let k in countSender) {
        //     d.push({count: countSender[k].c, labels: countSender[k].labels, sender: k})
        // }
        // return d;
    },

    getBySender: (sender, page, pageSize) =>{
        const offset = (page - 1) * pageSize;
        const limit = offset + pageSize;
        return realm.objects('Message').filtered('sender == $0', sender).filtered('labels == "INBOX"').sorted('date', true).slice(offset, limit);
    },

    getByDomain: (domain, page, pageSize) => {
        const offset = (page - 1) * pageSize;
        const limit = offset + pageSize;
        return realm.objects('Message').filtered('sender_domain == $0', domain).filtered('labels == "INBOX"').sorted('date', true).slice(offset, limit);
    },

    
    getById : (message_id) =>{
        return realm.objects('Message').filtered('message_id == $0', message_id)[0];;
    },

    fetchMessageIdBySenders:  (senders) => {
        // Open the realm with the Message schema
    
        // Create an empty array to store the results
        let results = [];
    
        // Loop through the senders array
        for (let sender of senders) {
            // Query the realm for the messages with the current sender
            let messages = realm.objects('Message').filtered('sender == $0', sender);
    
            // Loop through the messages and push their message_ids to the results array
            for (let message of messages) {
                results.push({message_id: message.message_id, labels: JSON.parse (JSON.stringify(message.labels||[])) });
            }
        }
    
        // Return the results array
        return results;
    },

    getLatestMessages: (page, pageSize) => {
        const offset = (page - 1) * pageSize;
        const limit = offset + pageSize;
        return realm.objects('Message').filtered('labels == "INBOX"').sorted('date', true).slice(offset, limit);
    },

    deleteAll: () => {
        realm.write(() => {
            realm.delete(realm.objects("Message"));
          });
    },

};

export default MessageService;