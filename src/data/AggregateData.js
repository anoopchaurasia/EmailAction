import MessageEvent from "../event/MessageEvent";
import MessageAggregateService from "./../realm/EmailAggregateService";

export default MessageAggregate = {
    listen: function() {
        return MessageEvent.on('new_message_received', MessageAggregate.aggregate);
    },
    aggregate: async function(messages) {
        let countSender = messages.reduce((acc, message) => {
            const sender = message.sender;
            if (!acc[sender]) {
                acc[sender] = {c: 0, labels: {}};
            }
            acc[sender].c++;
            message.labels.forEach(l=>{
                if(!acc[sender].labels[l]) acc[sender].labels[l]=0
                acc[sender].labels[l]++;
                if(l==="TRASH") acc[sender].c--;
            })
            return acc;
        }, {});
        let d = [];
        for(let k in countSender) {
            d.push({count: countSender[k].c, labels: countSender[k].labels, sender: k})
        }
        d.map(sender => {
            let labels = [];
            for (let k in sender.labels) {
                labels.push({
                    count: sender.labels[k],
                    id: k,
                    name: k
                })
            }
            return MessageAggregateService.updateCount({
                ...sender,
                labels: labels
            })
        });
        return d; 
    }
};