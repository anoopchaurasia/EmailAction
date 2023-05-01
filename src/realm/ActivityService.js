import Realm from 'realm';

// Define the Activity schema
const ActivitySchema = {
  name: 'Activity',
  properties: {
    id: 'string', // Add an id attribute
    from: {type:'string[]', index:true},
    to: {type: 'string[]', index:true},
    subject: {type: "string?", index: true},
    created_at:{type:'date', index: true},
    body: {type: "string?", index: true},
    from_label: "string?",
    to_label: "string?",
    delete_at: 'date?',
    completed: {type:"bool", index: true},
  },
  primaryKey: 'id', // Set the id as the primary key
};

// Create a realm instance with the schemas
const realm = new Realm({ schema: [ActivitySchema],  schemaVersion: 15, path:"activity"  });

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
    }
};


export default ActivityMethods;