package com.action.email.realm.model;

import io.realm.RealmObject;

public class MessageAggregateLabel extends RealmObject {
    private int count;
    private String id;

    public MessageAggregateLabel() {

    }
    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
}