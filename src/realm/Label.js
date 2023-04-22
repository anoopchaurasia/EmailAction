    // =  Define a Label class with the methods and the new propertie=> s
export default  Label ={
    deleteById : (id) => {
        realm.write(() => {
            let label = realm.objects('Label').filtered('id == $0', id)[0];
            if (label) {
                realm.delete(label);
            }
        });
    }
    ,
    // Update a Label object's name by id
    updateById : (id, newName) => {
        realm.write(() => {
            let label = realm.objects('Label').filtered('id == $0', id)[0];
            if (label) {
                label.name = newName;
            }
        });
    }
    ,
    getById : (id) =>{
        return realm.objects('Label').filtered('id == $0', id)[0];;
    }
    ,
    // Create and return a new Label object with the given name and other properties
    create : (label) => {
        realm.write(() => {
            realm.create('Label', label);
        });
        return label;
    }
    ,
    // Read and return all Label objects from the Realm
    readAll : () => {
        let labels = realm.objects('Label');
        return labels;
    }
}

// Define the schema for the Label model with the new properties
const LabelSchema = {
    name: 'Label',
    properties: {
        name: 'string',
        type: 'string',
        messagesTotal: 'int?',
        messagesUnread: 'int?',
        id: 'string'
    }
};

// Create a new Realm instance with the Label schema
const realm = new Realm({path: "labels",  schemaVersion: 5,  schema: [LabelSchema] });