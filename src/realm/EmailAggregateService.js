import Realm from 'realm';

import MessageEvent from '../event/MessageEvent';

// Define the Message schema
const MessageAggregateSchema = {
    name: 'MessageAggregate',
    primaryKey: 'sender',
    properties: {
        sender: {type:'string', indexed: true},
        labels: "Label[]",
        count: 'int',
        sender_name: {type:'string', indexed: true},
        sender_domain: {type:'string', indexed: true},
    },
};

const LabelSchema = {
    name: 'Label',
    properties: {
        count: 'int',
        id: "string"
    }
};

const migrationFunction = (oldRealm, newRealm) => {
    // Migrate your data here
};

// Create a new Realm instance with the Message schema
const realm = new Realm({
    path: "messageAggregate",
    schema: [MessageAggregateSchema, LabelSchema], schemaVersion: 7, migration: migrationFunction,
});

const MessageAggregateService = {
    create: (sender) => {
        try {
            realm.write(() => {
                realm.create('MessageAggregate', sender);
            });
        } catch (e) {
            console.error(e, sender, "MessageAggregateService.create");
        }
        MessageEvent.emit('message_aggregation_changed', {type:"create"});
    },

    deleteAll: () => {
        realm.write(() => {
            realm.delete(realm.objects("MessageAggregate"));
            ///label will be deleted by label service
        });
        MessageEvent.emit('message_aggregation_changed', {type: "delete"})
    },

    deleteBySender: (sender) => {
        sender = MessageAggregateService.readBySender(sender);
        realm.write(() => {
            realm.delete(sender);
        });
        console.log("delete sender", sender);
        MessageEvent.emit('message_aggregation_changed', {type:"delete"})
    },

    deleteBySenders: (senders) => {
        senders.forEach(sender=> MessageAggregateService.deleteBySender(sender));
    },

    deleteBySubDomain: (subdomanis) =>{
        subdomanis.forEach(subdomain=>{
            console.log("delete aggregated data for domain", subdomain);
            let data = realm.objects("MessageAggregate").filtered(`sender_domain=="${subdomain}"` );
            realm.write(() => {
                realm.delete(data);
            });
        });
        MessageEvent.emit('message_aggregation_changed', {type:"delete"})
    },

    readMessage: () => {
        return realm.objects('MessageAggregate').filtered('labels.id == "INBOX"').sorted('count', true).toJSON();
    },

    readAll: () => {
        return realm.objects('MessageAggregate');
    },

    count: () =>{
        return MessageAggregateService.readAll().length;
    },

    readBySender: (sender) => {
        return realm.objectForPrimaryKey('MessageAggregate', sender);
    },
    update: (sender) => {
        console.log(sender);
        realm.write(() => {
            realm.create('MessageAggregate', sender, true);
        });
        MessageEvent.emit('message_aggregation_changed', {type:"update"})
    },
    updateCount: (newData)=> {
        let messageAggregate = realm.objectForPrimaryKey('MessageAggregate', newData.sender);
        if(!messageAggregate) {
            return realm.write(() => {
                return realm.create('MessageAggregate', newData);
            });
        }
        realm.write(() => {
            messageAggregate.count += newData.count;
        });

        newData.labels.forEach(label => {
            realm.write(() => {
                let labelObject = realm.create('Label', { id: label.id, count:0 }, Realm.UpdateMode.Modified);
                labelObject.count += label.count;
            });
        });
        MessageEvent.emit('message_aggregation_changed', {type:"update"})
        return messageAggregate;
    }
}

export default MessageAggregateService;