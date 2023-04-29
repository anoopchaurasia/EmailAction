import Realm from 'realm';

// Define the Rule schema
const RuleSchema = {
  name: 'Rule',
  properties: {
    id: 'string', // Add an id attribute
    sender: 'string',
    domain: 'string',
    subject: 'string',
    subject_regex: 'string',
  },
  primaryKey: 'id', // Set the id as the primary key
};

// Define the Activity schema
const ActivitySchema = {
  name: 'Activity',
  properties: {
    id: 'string', // Add an id attribute
    message_ids: 'string[]',
    from_label: 'string?',
    to_label: 'string?',
    is_reverted: 'bool',
    has_rule: 'bool',
    rule: 'Rule?',
    created_at:'date',
    completed: {type:"bool", index: true},
  },
  primaryKey: 'id', // Set the id as the primary key
};

// Create a realm instance with the schemas
const realm = new Realm({ schema: [RuleSchema, ActivitySchema],  schemaVersion: 10, path:"activity"  });

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
      return realm.objects('Activity');
    }
};


export default ActivityMethods;