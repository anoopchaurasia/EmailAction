
import { NativeModules } from 'react-native';
const MessageServiceModule = NativeModules.MessageAggregateModule;
const MessageAggregateService = {
    create: async (sender) => {
       await MessageServiceModule.create(sender);
    },

    deleteAll: async () => {
        await MessageServiceModule.deleteAll();
    },

    deleteBySender: async (sender) => {
       await MessageServiceModule.deleteBySender(sender);
    },

    deleteBySenders: async (senders) => {
        await MessageServiceModule.deleteBySenders(senders);
    },

    deleteBySubDomain: async (subdomanis) =>{
            await MessageServiceModule.deleteBySubDomain(subdomain);
    },

    readMessage: async() => {
        return await MessageServiceModule.readMessage();
    },

    readAll: async () => {
        return await MessageServiceModule.readAll();
    },

    count: async () =>{
        return await MessageServiceModule.count();
    },

    readBySender: async (sender) => {
        return await MessageServiceModule.readBySender(sender);

    },
    update: async (sender) => {
        return await MessageServiceModule.update(sender);
    },
    updateCount: async(newData)=> {
        return await MessageServiceModule.updateCount(newData);
    }
}

export default MessageAggregateService;