import MessageEvent from "../event/MessageEvent";
import MessageAggregateService from "./../realm/EmailAggregateService";

export default MessageAggregate = {
    listen: function() {
        MessageEvent.on('updated_new_rule', MessageAggregate.handleRuleUpdate);
        MessageEvent.on('created_new_rule', MessageAggregate.handleRuleCreation);
        return //MessageEvent.on('new_message_received', MessageAggregate.aggregate);
    },
    handleRuleCreation: function({action, type, from}) {
        if((action==='move' || action==='delete' || action==='trash')) {
            if(type=='domain') {
                MessageAggregateService.deleteBySubDomain(from);
            } else if(type==='sender') {
                MessageAggregateService.deleteBySenders(from);
            }
        }
    },
    handleRuleUpdate: function({action, type, from}) {
        
        console.log(action, type, from, "testing1");
        if((action==='move' || action==='delete' || action==='trash')) {
            if(type=='domain') {
                MessageAggregateService.deleteBySubDomain(from);
            } else if(type==='sender') {
                MessageAggregateService.deleteBySenders(from);
            }
        }
    },
 
};

MessageAggregate.listen();