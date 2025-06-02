import AggregateData from './AggregateData';
import ProcessRules from './ProcessRules';


let in_progress = false;
export default Activity = {
    

    newMessages: async function (messages) {
        await ProcessRules.takeAction(messages);
        await AggregateData.aggregate(messages);
    },
};
