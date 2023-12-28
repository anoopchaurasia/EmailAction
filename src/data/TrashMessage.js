import ProcessRules from "./ProcessRules";

export default TrashMessage = {
    trashBySubDomains : async function(domains) {
        /// get all the domains name 
        /// create rule for trash
        console.log("TrashMessage", "rule creation for trash subdomain")
        return await ProcessRules.createNewRule({to_label:"trash"}, domains, 'trash', 'subdomain').catch(e=>{
            console.error("TrashMessage", "rule creation failed", e.message, e);
            if(e.message == 'rule already exist') return Alert.alert('Rule already exist', "There is already a rule for this sender. Please delete the rule and try again.");
            throw new Error(e);
        });
    },

    trashBySenders : async function(senders) {
        /// get all the senders name
        /// create rule for trash
        /// 
        console.log("TrashMessage", "rule creation to trash senders ");
        return await ProcessRules.createNewRule({to_label:"trash"}, senders, 'trash', 'sender').catch(e=>{
            console.error("TrashMessage","rule creation failed", e.message, e);
            if(e.message == 'rule already exist') return Alert.alert('Rule already exist', "There is already a rule for this sender. Please delete the rule and try again.");
            throw new Error(e);
        });

    }
}
