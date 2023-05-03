import MessageService from "../../realm/EmailMessageService";
import ActivityModel from "../../realm/ActivityService";

export default class Helper {
    static trashForSenderEmail = async (sender) =>{
        ActivityModel.createObject({
            to_label: 'trash',
            from: [sender],
            created_at: new Date,
            action:"trash",
            completed: false,
        });
    }


    static moveToFolder = async (label, sender, action) => {
        if(!action || !sender || !label) throw "no action provide"
        ActivityModel.createObject({
            from: [sender],
            created_at: new Date,
            completed: false,
            from_label:"INBOX",
            action:action,
            to_label: label.id
        });
    }
}