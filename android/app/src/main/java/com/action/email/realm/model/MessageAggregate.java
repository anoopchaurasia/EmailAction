package com.action.email.realm.model;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;
import io.realm.annotations.Index;
import io.realm.RealmList;


public class MessageAggregate extends RealmObject {
    @PrimaryKey
    @Index
    private String sender;

    private RealmList<MessageAggregateLabel> labels;

    private int count;

    @Index
    private String sender_name;

    @Index
    private String sender_domain;

    public void setLabelCount(MessageAggregate newData) {
//        for (MessageAggregateLabel label : newData.getLabels()) {
//            MessageAggregateLabel existingLabel = r.createObject(MessageAggregateLabel.class, label.getId());
//            this.setCount(existingLabel.getCount() + label.getCount());
//        }
    }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public RealmList<MessageAggregateLabel> getLabels() { return labels; }
    public void setLabels(RealmList<MessageAggregateLabel> labels) { this.labels = labels; }

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
        // set other fields as needed
        return agg;
    }

    public WritableMap toMap() {
        WritableMap map = Arguments.createMap();
        map.putString("sender", getSender());
        map.putString("sender_domain", getSender_domain());
        map.putInt("count", getCount());
        // add other fields
        return map;
    }
}




