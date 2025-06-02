package com.action.email.realm.model;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.HashMap;
import java.util.Map;

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

    public void increment() {
        count +=1;
    }

    public WritableMap toMap() {
        WritableMap map = Arguments.createMap();
        map.putString("id", id);
        map.putInt("count", count);
        return map;
    }

    public static MessageAggregateLabel fromMap(ReadableMap map) {
        MessageAggregateLabel label = new MessageAggregateLabel();
        if (map.hasKey("id")) label.setId(map.getString("id"));
        if (map.hasKey("count")) label.setCount(map.getInt("count"));
        return label;
    }
}