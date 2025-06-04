package com.action.email.data;


import android.os.Build;

import androidx.annotation.NonNull;

import com.action.email.realm.model.MessageAggregate;
import com.action.email.realm.model.MessageAggregateLabel;
import com.action.email.realm.service.MessageAggregateService;
import com.action.email.realm.model.Message;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import io.realm.Realm;
import io.realm.RealmList;
import io.realm.RealmObject;
import io.realm.RealmSet;

public class MessageAggregateData {

    public static List<MessageAggregate> buildAggregatesFromMessages(List<Message> messages) {
        Map<String, List<Message>> groupedBySender = new HashMap<>();

        for (Message msg : messages) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                groupedBySender
                        .computeIfAbsent(msg.getSender(), k -> new ArrayList<>())
                        .add(msg);
            }
        }

        List<MessageAggregate> aggregates = new ArrayList<>();

        for (Map.Entry<String, List<Message>> entry : groupedBySender.entrySet()) {
            String sender = entry.getKey();
            List<Message> senderMessages = entry.getValue();

            int newCount = senderMessages.size();
            Map<String, Integer> newLabelCounts = new HashMap<>();

            for (Message msg : senderMessages) {
                if (msg.getLabels() != null) {
                    for (String label : msg.getLabels()) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                            newLabelCounts.put(label, newLabelCounts.getOrDefault(label, 0) + 1);
                        }
                    }
                }
            }

            // Now update or create the aggregate
            MessageAggregateService.withTransaction((realm, existingAgg) -> {
                MessageAggregate agg;

                if (existingAgg == null) {
                    agg = realm.createObject(MessageAggregate.class, sender);
                    agg.setCount(newCount);
                    agg.setSender_name(senderMessages.get(0).getSender_name());
                    agg.setSender_domain(senderMessages.get(0).getSender_domain());
                    agg.setLabels(new RealmSet<>());
                } else {
                    agg = existingAgg;
                    agg.setCount(agg.getCount() + newCount);
                }

                // Merge label counts
                for (Map.Entry<String, Integer> labelEntry : newLabelCounts.entrySet()) {
                    String labelId = labelEntry.getKey();
                    int addCount = labelEntry.getValue();
                    boolean found = false;

                    if (agg.getLabels() == null) {
                        agg.setLabels(new RealmSet<>());
                    }

                    for (MessageAggregateLabel l : agg.getLabels()) {
                        if (l.getId().equals(labelId)) {
                            l.setCount(l.getCount() + addCount);
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        MessageAggregateLabel newLabel = realm.createObject(MessageAggregateLabel.class);
                        newLabel.setId(labelId);
                        newLabel.setCount(addCount);
                        agg.getLabels().add(newLabel);
                    }
                }
                realm.insertOrUpdate(agg);
                aggregates.add(realm.copyFromRealm(agg)); // Add to return list

            }, sender);
        }

        return aggregates;
    }

    public static void onMessageDeleted(Message message) {
        MessageAggregateService.withTransaction((realm, agg) -> {
            if (agg == null) return;

            agg.setCount(agg.getCount() - 1);
            if (agg.getCount() <= 0) {
                agg.deleteFromRealm();
                return;
            }

            if (message.getLabels() != null) {
                for (String label : message.getLabels()) {
                    decrementLabelCount(realm, agg, label);
                }
            }
            realm.insertOrUpdate(agg);
        }, message.getSender());
    }

    public static void onLabelAdded(Message message, String label) {
        MessageAggregateService.withTransaction((realm, agg) -> {
            if (agg == null) return;
            incrementLabelCount(realm, agg, label);
            realm.insertOrUpdate(agg);
        }, message.getSender());
    }

    public static void onLabelRemoved(Message message, String label) {
        MessageAggregateService.withTransaction((realm, agg) -> {
            if (agg == null) return;
            decrementLabelCount(realm, agg, label);
            realm.insertOrUpdate(agg);
        }, message.getSender());
    }

    private static void incrementLabelCount(Realm realm, MessageAggregate agg, String label) {
        if (agg.getLabels() == null) return;

        for (MessageAggregateLabel l : agg.getLabels()) {
            if (l.getId().equals(label)) {
                l.setCount(l.getCount() + 1);
                return;
            }
        }

        MessageAggregateLabel newLabel = realm.createObject(MessageAggregateLabel.class);
        newLabel.setId(label);
        newLabel.setCount(1);
        agg.getLabels().add(newLabel);
    }

    private static void decrementLabelCount(Realm realm, MessageAggregate agg, String label) {
        if (agg.getLabels() == null) return;

        Iterator<MessageAggregateLabel> iterator = agg.getLabels().iterator();
        while (iterator.hasNext()) {
            MessageAggregateLabel l = iterator.next();
            if (l.getId().equals(label)) {
                int newCount = l.getCount() - 1;
                if (newCount <= 0) {
                    l.deleteFromRealm();
                } else {
                    l.setCount(newCount);
                }
                return;
            }
        }
    }
}