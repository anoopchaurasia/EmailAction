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
    action: "string", /// actions [trash, delete, move]
    type: 'string', /// options are [sender, domain, sub domain]
    from_label: "string?", /// default inbox
    to_label: "string?", /// 
    title: "string",
    delete_at: 'date?', /// no longer excecuted 
    completed: {type:"bool", indexed: true, default: false}, /// completed first execution.
  },
  primaryKey: 'id', // Set the id as the primary key
};

// Create a realm instance with the schemas
const realm = new Realm({ schema: [ActivitySchema],  schemaVersion: 20, path:"activity"  });

const EMAIL_REGEX = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
const DOMAIN_REGEX= new RegExp(/^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/);

// Create an object to store the methods
const ActivityMethods = {
  // Define a method to create a new object in the realm
  createObject(data) {
    data.id = data.id || Math.random().toString(36).slice(2);
    data.created_at = new Date;
    console.log(data);
    ActivityMethods.validate(data)
    try {
      realm.write(() => {
        realm.create('Activity', data);
      });
    } catch (error) {
      console.error(error);
    }
    return data;
  },

  deleteAll: () => {
    realm.write(() => {
        realm.delete(realm.objects("Activity"));
    });
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
    console.log(id, data);
    ActivityMethods.validate(data, true);
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
  validate(activity, isUpdate=false) {
    if(isUpdate) {
        activity.from && activity.from.forEach(f=> ActivityMethods.validateFrom(f));
        activity.title && ActivityMethods.validateTitle(activity.title);
        activity.to_label && ActivityMethods.validateToLabel(activity.to_label);
    } else {
      activity.from.forEach(f=> ActivityMethods.validateFrom(f));
      ActivityMethods.validateTitle(activity.title);
      ActivityMethods.validateToLabel(activity.to_label);
    }
  },
  getAll() {
      return realm.objects('Activity').toJSON();
    },
    getBySender(sender) {
      return realm.objects('Activity').filtered('from CONTAINS $0', sender);
    },

    validateFrom(from) {
      console.log(from.match(DOMAIN_REGEX), from.match(EMAIL_REGEX));
      if(from.match(EMAIL_REGEX) === null && from.match(DOMAIN_REGEX)===null) throw new Error("" + from + " is not a valid email id or domain")
    },
    
    validateTitle(title) {
      if(!title || title.length<3) throw new Error("The length of the title " + title + " is lss than 3")
    },

    validateToLabel(labelId) {
      if(!labelId) throw new Error("Label/Folder required to setup rule");
    }
};


export default ActivityMethods;