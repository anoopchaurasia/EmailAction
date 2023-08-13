import ProcessRules from "./ProcessRules";

export default TrashMessage = {
    trashBySubDomains : async function(domains) {
        /// get all the domains name 
        /// create rule for trash
        console.log("rule creation for trash subdomain")
        return await ProcessRules.createNewRule({to_label:"trash"}, domains, 'trash', 'subdomain').catch(e=>{
            console.log("rule creation failed", e.message, e);
            if(e.message == 'rule already exist') return Alert.alert('Rule already exist', "There is already a rule for this sender. Please delete the rule and try again.");
            throw new Error(e);
        });
    },

    trashBySenders : async function(senders) {
        /// get all the senders name
        /// create rule for trash
        /// 
        console.log("rule creation to trash senders ");
        return await ProcessRules.createNewRule({to_label:"trash"}, senders, 'trash', 'sender').catch(e=>{
            console.log("rule creation failed", e.message, e);
            if(e.message == 'rule already exist') return Alert.alert('Rule already exist', "There is already a rule for this sender. Please delete the rule and try again.");
            throw new Error(e);
        });

    }
}

    // function trashBySender(x) {
    //     let item = list.find(l => l.sender == x.sender);
    //     selected[x.sender] = item;
    //     moveToTrash();
    // }

        // async function moveToTrash() {
    //     await commonAction(async sender=> await ProcessRules.createNewRule({to_label:"trash"}, sender, 'trash')).catch(e=>{
    //         if(e.message == 'rule already exist') return Alert.alert('Rule already exist', "There is already a rule for this sender. Please delete the rule and try again.");
    //     });
    // }

    // async function commonAction(action) {
    //     if (Object.values(selected).length == 0) return console.log("no selection");
    //     console.log('action', Object.values(selected).map(x => x.sender));
    //     let senders = Object.values(selected).map(x => x.sender);
    //     let newlist = list.map(x => x);
    //     for (let i = 0; i < senders.length; i++) {
    //         let sender = senders[i];
    //         await action(sender);
    //         MessageAggregateService.deleteBySender(sender);
    //         let index = newlist.indexOf(selected[sender]);
    //         delete selected[sender];
    //         console.log(newlist.length);
    //         index != -1 && newlist.splice(index, 1);
    //         console.log(index, selected, newlist.length);
    //     }
    //     setList(newlist);
    //     setSelected({});
    // }