package com.action.email.data;


import androidx.annotation.NonNull;

import com.action.email.realm.model.MessageAggregate;
import com.action.email.realm.model.MessageAggregateLabel;
import com.action.email.realm.service.MessageAggregateService;
import com.action.email.realm.model.Message;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.realm.RealmList;
import io.realm.RealmObject;

public class MessageAggregateData {

//    public static void listen() {
//        MessageEvent.on("updated_new_rule", MessageAggregateModule::handleRuleUpdate);
//        MessageEvent.on("created_new_rule", MessageAggregateModule::handleRuleCreation);
//        // MessageEvent.on("new_message_received", MessageAggregateModule::aggregate);
//    }

//    public static void handleRuleCreation(Map<String, Object> data) {
//        String action = (String) data.get("action");
//        String type = (String) data.get("type");
//        String from = (String) data.get("from");
//
//        if (action != null && (action.equals("move") || action.equals("delete") || action.equals("trash"))) {
//            if ("domain".equals(type)) {
//                MessageAggregateService.deleteBySubDomain(from);
//            } else if ("sender".equals(type)) {
//                MessageAggregateService.deleteBySenders(from);
//            }
//        }
//    }
//
//    public static void handleRuleUpdate(Map<String, Object> data) {
//        String action = (String) data.get("action");
//        String type = (String) data.get("type");
//        String from = (String) data.get("from");
//
//        System.out.println(action + ", " + type + ", " + from + ", testing1");
//
//        if (action != null && (action.equals("move") || action.equals("delete") || action.equals("trash"))) {
//            if ("domain".equals(type)) {
//                MessageAggregateService.deleteBySubDomain(from);
//            } else if ("sender".equals(type)) {
//                MessageAggregateService.deleteBySenders(from);
//            }
//        }
//    }

    public static List<Map<String, Object>> aggregate(List<Message> messages) {
        Map<String, MessageAggregate> countSender = getStringMessageAggregateMap(messages);

        List<Map<String, Object>> result = new ArrayList<>();
        for (MessageAggregate senderStat : countSender.values()) {
            MessageAggregateService.updateCount(senderStat);
        }
        System.out.println("MessageAggregate.aggregate - aggregation done");
        return result;
    }

    private static @NonNull Map<String, MessageAggregate> getStringMessageAggregateMap(List<Message> messages) {
        Map<String, MessageAggregate> countSender = new HashMap<>();
        for (Message message : messages) {
            String sender = message.getSender();
            if (!countSender.containsKey(sender)) {
                MessageAggregate messageAggregate = new MessageAggregate();
                messageAggregate.setSender(message.getSender());
                messageAggregate.setSender_domain(message.getSender_domain());
                messageAggregate.setCount(0);
                countSender.put(sender, messageAggregate);
            }
            MessageAggregate messageAggregate = countSender.get(sender);
            messageAggregate.incrementCount();

            Map<String, MessageAggregateLabel> messageAggregateLabelMap = new HashMap<>();
            for (String label : message.getLabels()) {
                MessageAggregateLabel messageAggregateLabel = messageAggregateLabelMap.get(label);
                if(messageAggregateLabel==null) {
                    messageAggregateLabel = new MessageAggregateLabel();
                    messageAggregateLabel.setId(label);
                    messageAggregateLabel.setCount(0);
                }
                messageAggregateLabel.increment();
                if ("TRASH".equals(label)) {
                    messageAggregate.decrementCount();
                }
            }
            messageAggregate.setLabels(MessageAggregateData.toRealmList(new ArrayList<>(messageAggregateLabelMap.values())) );
        }
        return countSender;
    }

     public static <T extends RealmObject> RealmList<T> toRealmList(List<T> list) {
        RealmList<T> realmList = new RealmList<>();
        if (list != null) {
            realmList.addAll(list);
        }
        return realmList;
    }
}