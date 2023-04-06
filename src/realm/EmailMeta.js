import Realm from 'realm';

// Define the Message schema
const MessageSchema = {
    name: 'Message',
    primaryKey: 'message_id',
    properties: {
        message_id: 'string',
        subject: 'string',
        sender: 'string',
        sender_domain: 'string',
        date: 'date',
        created_at: 'date',
    },
};

const migrationFunction = (oldRealm, newRealm) => {
    // Migrate your data here
};

// Create a new Realm instance with the Message schema
const realm = new Realm({
    schema: [MessageSchema], schemaVersion: 3, migration: migrationFunction,
});

// Define CRUD methods for Message objects
const MessageService = {
    create: (message) => {
        try{
            realm.write(() => {
                realm.create('Message', message);
            });
        } catch(e) {
          //  console.error(e, message);
        }
    },

    readAll: () => {
        return realm.objects('Message');
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

    getCountBySenderDomain: () => {
        const messages = realm.objects('Message');
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

    getCountBySender: () => {
        const messages = realm.objects('Message');
        let countSender = messages.reduce((acc, message) => {
            const sender = message.sender;
            if (!acc[sender]) {
                acc[sender] = 0;
            }
            acc[sender]++;
            return acc;
        }, {});
        let d = [];
        for(let k in countSender) {
            d.push({v: countSender[k], k})
        }
        return d;
    },
};

export default MessageService;