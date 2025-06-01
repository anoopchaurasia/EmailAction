import { NativeModules } from 'react-native';
const LabelModule = NativeModules.LabelModule;

    // =  Define a Label class with the methods and the new propertie=> s
let idNameMap = {};
export default  Label ={
    deleteById : async(id) => {
        await LabelModule.deleteById(id);
        Label.getMap();
    }
    ,
    // Update a Label object's name by id
    updateById : async(id, newName) => {
        await LabelModule.updateById(id, newName);
        Label.getMap();
    }
    ,
    getById :async(id) =>{
        return await LabelModule.getById(id);
        Label.getMap();
    }
    ,
    // Create and return a new Label object with the given name and other properties
    create : async(label) => {
        label = await LabelModule.create(label);
        Label.getMap();
        return label;
    }
    ,
    // Read and return all Label objects from the Realm
    readAll : async () => {
        return await LabelModule.readAll();
    },

    getMap : async() =>{
        let labels = await Label.readAll();
        let map = {};
        labels.forEach(x=> {
            map[x.id] = x.name;
        });
        idNameMap = map;
        return map;
    },

    getNameById: (id) => {
        return idNameMap[id];
    },

    deleteAll: () => {
        LabelModule.deleteAll();
    },
}

Label.getMap();