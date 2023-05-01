import MessageService from "../../realm/EmailMessageService";
import ActivityModel from "../../realm/ActivityService";

export default class Helper {
    static trashForSenderEmail = async (sender) =>{
        ActivityModel.createObject({
            to_label: ['trash'],
            from: [sender],
            created_at: new Date,
            completed: false,
        });
    }


    static mooveToFolder = async (label, sender) => {
        ActivityModel.createObject({
            from: [sender],
            created_at: new Date,
            completed: false,
            from_label:"INBOX",
            to_label: label.id
        });
    }
}