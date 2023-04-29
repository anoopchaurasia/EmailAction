import Realm from 'realm';

// Define the Message schema
const MessageAggregateSchema = {
    name: 'MessageAggregate',
    primaryKey: 'sender',
    properties: {
        sender: 'string',
        labels: "Label[]",
        count: 'int'
    },
};

const LabelSchema = {
    name: 'Label',
    properties: {
      count: 'int',
      id:"string"
    }
  };

const migrationFunction = (oldRealm, newRealm) => {
    // Migrate your data here
};

// Create a new Realm instance with the Message schema
const realm = new Realm({
    path: "messageAggregate",
    schema: [MessageAggregateSchema, LabelSchema], schemaVersion: 6, migration: migrationFunction,
});

const MessageAggregateService = {
    create: (sender) => {
        try{
            realm.write(() => {
                realm.create('MessageAggregate', sender);
            });
        } catch(e) {
            console.error(e, sender);
        }
    },

    deleteAll: () => {
        realm.write(() => {
            realm.delete(realm.objects("MessageAggregate"));
          });
    },

    deleteBySender: (sender)=> {
        sender = MessageAggregateService.readBySender(sender);
        realm.write(() => {
            realm.delete(sender);
        });
    },

    readMessage: () => {
        return realm.objects('MessageAggregate').filtered('labels.id == "INBOX"').sorted('count', true).toJSON();
    },

    readAll: () => {
        return realm.objects('MessageAggregate');
    },

    readBySender: (sender) => {
        return realm.objectForPrimaryKey('MessageAggregate', sender);
    },
    update: (sender) => {
        console.log(sender);
        realm.write(() => {
            realm.create('MessageAggregate', sender, true);
        });
    }
}

export default MessageAggregateService;