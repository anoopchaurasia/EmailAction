import Realm from 'realm';

// Define the Activity schema
const ActivitySchema = {
  name: 'Activity',
  properties: {
    id: 'string', // Add an id attribute
    from: {type:'string[]'}, ///[senders, domains, sub domains ]
    to: {type: 'string[]'},  /// sender
    subject: {type: "string?", indexed: true}, /// subject of the message for query
    created_at:{type:'date', indexed: true}, ///  
    body: {type: "string?", indexed: true}, /// part of body for the query
    delay: {type: 'int', default: 0}, /// delay in execustion of the rule
    action: "string", /// actions [trash, delete, ]
    type: 'string', /// options are [sender, domain, sub domain]
    from_label: "string?", /// default inbox
    to_label: "string?", /// 
    delete_at: 'date?', /// no longer excecuted 
    completed: {type:"bool", indexed: true}, /// completed first execution.
  },
  primaryKey: 'id', // Set the id as the primary key
};

// Create a realm instance with the schemas
const realm = new Realm({ schema: [ActivitySchema],  schemaVersion: 18, path:"activity"  });

// Create an object to store the methods
const ActivityMethods = {
  // Define a method to create a new object in the realm
  createObject(data) {
    data.id = Math.random().toString(36).slice(2);
    console.log(data);
    try {
      realm.write(() => {
        realm.create('Activity', data);
      });
    } catch (error) {
      console.error(error);
    }
  },

  getNoCompleted() {
    return realm.objects('Activity').filtered('completed == $0', false);
  },

  // Define a method to delete an object from the realm by id
  deleteObjectById( id) {
    try {
      realm.write(() => {
        const object = realm.objectForPrimaryKey('Activity', id);
        if (object) {
          realm.delete(object);
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  // Define a method to update an object in the realm by id
  updateObjectById(id, data) {
    try {
      realm.write(() => {
        const object = realm.objectForPrimaryKey('Activity', id);
        if (object) {
          Object.assign(object, data);
        }
      });
    } catch (error) {
      console.error(error);
    }
  },
  getAll() {
      return realm.objects('Activity').toJSON();
    },
    getBySender(sender) {
      return realm.objects('Activity').filtered('from CONTAINS $0', sender);
    } 
    
};


export default ActivityMethods;