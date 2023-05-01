import MessageService from "../../realm/EmailMessageService";
import ActivityModel from "../../realm/ActivityService";

export default class Helper {
    static trashForSenderEmail = async (sender) =>{
        let data = await MessageService.fetchMessageIdBySenders([sender]);
        data = data.filter(({ labels }) => labels.includes("TRASH") == false).map(x=> x.message_id);
        ActivityModel.createObject({
            to: ['trash'],
            from: [sender],
            created_at: new Date,
            completed: false,
        });
    }
}