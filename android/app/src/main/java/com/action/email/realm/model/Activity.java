package com.action.email.realm.model;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;
import io.realm.annotations.Index;
import io.realm.RealmList;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class Activity extends RealmObject {
    @PrimaryKey
    private String id;

    private RealmList<String> from;  // list of senders, domains, subdomains
    private RealmList<String> to;    // list of senders

    @Index
    private String subject;

    @Index
    private Date created_at;

    @Index
    private String body;

    private int delay = 0; // default 0

    private String action;  // [trash, delete, move]
    private String type;    // [sender, domain, subdomain]

    private String from_label;
    private String to_label;
    private String title;

    private Date delete_at;

    @Index
    private boolean completed = false; // default false

    private Date ran_at;

    // Getters and setters for all fields

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public RealmList<String> getFrom() { return from; }
    public void setFrom(RealmList<String> from) { this.from = from; }

    public RealmList<String> getTo() { return to; }
    public void setTo(RealmList<String> to) { this.to = to; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Date getCreated_at() { return created_at; }
    public void setCreated_at(Date created_at) { this.created_at = created_at; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public int getDelay() { return delay; }
    public void setDelay(int delay) { this.delay = delay; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getFrom_label() { return from_label; }
    public void setFrom_label(String from_label) { this.from_label = from_label; }

    public String getTo_label() { return to_label; }
    public void setTo_label(String to_label) { this.to_label = to_label; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Date getDelete_at() { return delete_at; }
    public void setDelete_at(Date delete_at) { this.delete_at = delete_at; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public Date getRan_at() { return ran_at; }
    public void setRan_at(Date ran_at) { this.ran_at = ran_at; }

    public static Activity fromMap(ReadableMap map) {
        Activity activity = new Activity();

        if (map.hasKey("id") && !map.isNull("id")) {
            activity.setId(map.getString("id"));
        }

        if (map.hasKey("from") && map.getType("from") == ReadableType.Array) {
            ReadableArray fromArray = map.getArray("from");
            RealmList<String> fromList = new RealmList<>();
            for (int i = 0; i < fromArray.size(); i++) {
                fromList.add(fromArray.getString(i));
            }
            activity.setFrom(fromList);
        }

        if (map.hasKey("to") && map.getType("to") == ReadableType.Array) {
            ReadableArray toArray = map.getArray("to");
            RealmList<String> toList = new RealmList<>();
            for (int i = 0; i < toArray.size(); i++) {
                toList.add(toArray.getString(i));
            }
            activity.setTo(toList);
        }

        if (map.hasKey("subject") && !map.isNull("subject")) {
            activity.setSubject(map.getString("subject"));
        }

        if (map.hasKey("created_at") && !map.isNull("created_at")) {
            activity.setCreated_at(new Date((long) map.getDouble("created_at")));
        }

        if (map.hasKey("body") && !map.isNull("body")) {
            activity.setBody(map.getString("body"));
        }

        if (map.hasKey("delay") && !map.isNull("delay")) {
            activity.setDelay(map.getInt("delay"));
        }

        if (map.hasKey("action") && !map.isNull("action")) {
            activity.setAction(map.getString("action"));
        }

        if (map.hasKey("type") && !map.isNull("type")) {
            activity.setType(map.getString("type"));
        }

        if (map.hasKey("from_label") && !map.isNull("from_label")) {
            activity.setFrom_label(map.getString("from_label"));
        }

        if (map.hasKey("to_label") && !map.isNull("to_label")) {
            activity.setTo_label(map.getString("to_label"));
        }

        if (map.hasKey("title") && !map.isNull("title")) {
            activity.setTitle(map.getString("title"));
        }

        if (map.hasKey("delete_at") && !map.isNull("delete_at")) {
            activity.setDelete_at(new Date((long) map.getDouble("delete_at")));
        }

        if (map.hasKey("completed") && !map.isNull("completed")) {
            activity.setCompleted(map.getBoolean("completed"));
        }

        if (map.hasKey("ran_at") && !map.isNull("ran_at")) {
            activity.setRan_at(new Date((long) map.getDouble("ran_at")));
        }

        return activity;
    }

    public WritableMap toMap() {
        WritableMap map = new WritableNativeMap();

        map.putString("id", id);

        WritableArray fromArray = new WritableNativeArray();
        if (from != null) {
            for (String f : from) {
                fromArray.pushString(f);
            }
        }
        map.putArray("from", fromArray);

        WritableArray toArray = new WritableNativeArray();
        if (to != null) {
            for (String t : to) {
                toArray.pushString(t);
            }
        }
        map.putArray("to", toArray);

        map.putString("subject", subject);
        map.putDouble("created_at", created_at != null ? created_at.getTime() : 0);
        map.putString("body", body);
        map.putInt("delay", delay);
        map.putString("action", action);
        map.putString("type", type);
        map.putString("from_label", from_label);
        map.putString("to_label", to_label);
        map.putString("title", title);
        map.putDouble("delete_at", delete_at != null ? delete_at.getTime() : 0);
        map.putBoolean("completed", completed);
        map.putDouble("ran_at", ran_at != null ? ran_at.getTime() : 0);

        return map;
    }
}
