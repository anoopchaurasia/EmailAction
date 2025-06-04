
import { NativeModules } from 'react-native';
const MessageServiceModule = NativeModules.MessageModule;
// Define the Message schema


// Define CRUD methods for Message objects
const MessageService = {
    create: (message) => {
        MessageServiceModule.create(message);
    },

    readMessage: () => {
        MessageServiceModule.readMessage();
    },

    readAll: async () => {
        let messages = await MessageServiceModule.readAll();
        return  messages;
    },

    getCount: async () => {
        return await MessageServiceModule.getCount();
    },

    readById: (id) => {
        return MessageServiceModule.readById(id);
    },

    update: (message) => {
        MessageServiceModule.update(message);
    },

    delete: (message) => {
        MessageServiceModule.delete(message);
    },

    checkMessageId: async (message_id) => {

       return await MessageServiceModule.checkMessageId(message_id);
    },

    getCountBySenderDomain: async () => {
       return await MessageServiceModule.getCountBySenderDomain();
    },

    getCountBySender: async (sender) => {
        return await MessageServiceModule.getCountBySender(sender);
    },

    getBySender: async (sender, page, pageSize) =>{
        return await MessageServiceModule.getBySender(sender, page, pageSize);
    },

    getByDomain: async (domain, page, pageSize) => {
        return await MessageServiceModule.getByDomain(domain, page, pageSize);
    },


    getById : async (message_id) =>{
        return await MessageServiceModule.getById(message_id);
    },

    fetchMessageIdBySenders:  async (senders) => {
        return await MessageServiceModule.fetchMessageIdBySenders(senders);
    },

    getLatestMessages: async (page, pageSize) => {
        return await MessageServiceModule.getLatestMessages(page, pageSize);
    },

    deleteAll: () => {
        MessageServiceModule.deleteAll();
    },

    updateAttachmentById: (attachment) => {
        MessageServiceModule.updateAttachmentById(attachment);
    },
     resyncData: async () => {
        return await MessageServiceModule.resyncData();
    },
};

export default MessageService;