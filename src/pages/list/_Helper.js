import MessageService from "../../realm/EmailMessage";
import ActivityModel from "../../realm/Activity";

export default class Helper {

    static trashForSenderEmail = async (sender) =>{
        let data = await MessageService.fetchMessageIdBySenders([sender]);
        data = data.filter(({ labels }) => labels.includes("TRASH") == false).map(x=> x.message_id);
        ActivityModel.createObject({
            message_ids: data,
            to_label: 'trash',
            is_reverted: false,
            has_rule: false,
            created_at: new Date,
            completed: false,
        });
    }
}