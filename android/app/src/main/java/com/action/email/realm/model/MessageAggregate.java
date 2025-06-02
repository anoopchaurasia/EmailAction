package com.action.email.realm.model;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.List;
import java.util.Optional;

import io.realm.RealmObject;
import io.realm.RealmSet;
import io.realm.annotations.PrimaryKey;
import io.realm.annotations.Index;
import io.realm.RealmList;


public class MessageAggregate extends RealmObject {
    @PrimaryKey
    @Index
    private String sender;

    private RealmSet<MessageAggregateLabel> labels;

    private int count;

    @Index
    private String sender_name;

    @Index
    private String sender_domain;

    public void setLabelCount(MessageAggregate newData) {
//        for (MessageAggregateLabel label : newData.getLabels()) {
//            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
//                MessageAggregateLabel existingLabel = this.labels.stream().filter(l-> l.getId().equals(label.getId()) ).findFirst();
//                if(existingLabel==null) {
//
//                }
//
//            }
//        }
    }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public RealmSet<MessageAggregateLabel> getLabels() { return labels; }
    public void setLabels(RealmSet<MessageAggregateLabel> labels) { this.labels = labels; }

    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }

    public String getSender_name() { return sender_name; }
    public void setSender_name(String sender_name) { this.sender_name = sender_name; }

    public String getSender_domain() { return sender_domain; }
    public void setSender_domain(String sender_domain) { this.sender_domain = sender_domain; }

    public static MessageAggregate fromMap(ReadableMap map) {
        MessageAggregate agg = new MessageAggregate();
        agg.setSender(map.getString("sender"));
        agg.setSender_domain(map.getString("sender_domain"));
        agg.setCount(map.getInt("count"));
        if (map.hasKey("labels") && map.getType("labels").name().equals("Array")) {
            ReadableArray labelArray = map.getArray("labels");
            RealmSet<MessageAggregateLabel> set = new RealmSet<>();

            for (int i = 0; i < labelArray.size(); i++) {
                ReadableMap labelMap = labelArray.getMap(i);
                set.add(MessageAggregateLabel.fromMap(labelMap));
            }

            agg.setLabels(set);
        }
        return agg;
    }

    public WritableMap toMap() {
        WritableMap map = Arguments.createMap();
        map.putString("sender", getSender());
        map.putString("sender_domain", getSender_domain());
        map.putInt("count", getCount());
        WritableArray labelArray = Arguments.createArray();
        if (labels != null) {
            for (MessageAggregateLabel label : labels) {
                labelArray.pushMap(label.toMap());
            }
        }
        map.putArray("labels", labelArray);
        return map;
    }

    public void incrementCount() {
        count += 1;
    }

    public void decrementCount() {
        count -= 1;
    }
}




