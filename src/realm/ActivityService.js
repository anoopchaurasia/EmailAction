import { NativeModules } from 'react-native';
const ActivityModule = NativeModules.ActivityModule;


const ActivityMethods = {
  // Define a method to create a new object in the realm
  async createObject(data) {
    await ActivityModule.createObject(data);
  },

  deleteAll: async () => {
    await ActivityModule.deleteAll();
  },

  getNoCompleted: async () => {
    let a = await ActivityModule.getNoCompleted();
    return a;
  },

  // Define a method to delete an object from the realm by id
  async deleteObjectById(id) {
    await ActivityModule.deleteObjectById(id);
  },

  // Define a method to update an object in the realm by id
  async updateObjectById(id, data) {
      await ActivityModule.updateObjectById(id, data);
  },


  async validate(activity, isUpdate=false) {
    ActivityModule.validate(activity, isUpdate);
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
  // Define a method to get all objects from the realm
    async getAll() {
      return await ActivityModule.getAll();
    },

    // Define a method to get objects by sender
    async getBySender(sender) {
      return await ActivityModule.getBySender(sender);
    },

    // Define a method to get objects by id
    async getById(id) {
      return await ActivityModule.getById(id);
    },

    // Define a method to get all activities
    async getAllActivities() {
      return await ActivityModule.getAllActivities();
    },

    async getBySender(sender) {
      return await ActivityModule.getBySender(sender);
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