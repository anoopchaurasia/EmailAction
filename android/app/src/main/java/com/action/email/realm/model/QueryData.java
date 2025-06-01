package com.action.email.realm.model;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.Date;

import io.realm.RealmObject;
import io.realm.annotations.RealmClass;

@RealmClass
public class QueryData extends RealmObject {
    private String from;
    private String to;
    private String subject;
    private String body;
    private String notHas;
    private Boolean has;
    private java.util.Date after;
    private java.util.Date before;

    // Getters and Setters
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getNotHas() { return notHas; }
    public void setNotHas(String notHas) { this.notHas = notHas; }

    public Boolean getHas() { return has; }
    public void setHas(Boolean has) { this.has = has; }

    public java.util.Date getAfter() { return after; }
    public void setAfter(java.util.Date after) { this.after = after; }

    public java.util.Date getBefore() { return before; }
    public void setBefore(java.util.Date before) { this.before = before; }


    public static QueryData fromMap(ReadableMap map) {
        QueryData data = new QueryData();

        if (map.hasKey("from") && !map.isNull("from")) {
            data.setFrom(map.getString("from"));
        }

        if (map.hasKey("to") && !map.isNull("to")) {
            data.setTo(map.getString("to"));
        }

        if (map.hasKey("subject") && !map.isNull("subject")) {
            data.setSubject(map.getString("subject"));
        }

        if (map.hasKey("body") && !map.isNull("body")) {
            data.setBody(map.getString("body"));
        }

        if (map.hasKey("notHas") && !map.isNull("notHas")) {
            data.setNotHas(map.getString("notHas"));
        }

        if (map.hasKey("has") && !map.isNull("has")) {
            data.setHas(map.getBoolean("has"));
        }

        if (map.hasKey("after") && !map.isNull("after")) {
            // Assuming you passed a timestamp in milliseconds
            data.setAfter(new Date((long) map.getDouble("after")));
        }

        if (map.hasKey("before") && !map.isNull("before")) {
            data.setBefore(new Date((long) map.getDouble("before")));
        }

        return data;
    }

    public WritableMap toMap() {
        WritableMap map = Arguments.createMap();
        QueryData data = this;
        map.putString("from", data.getFrom());
        map.putString("to", data.getTo());
        map.putString("subject", data.getSubject());
        map.putString("body", data.getBody());
        map.putString("notHas", data.getNotHas());

        if (data.getHas() != null) {
            map.putBoolean("has", data.getHas());
        } else {
            map.putNull("has");
        }

        if (data.getAfter() != null) {
            map.putDouble("after", data.getAfter().getTime());
        } else {
            map.putNull("after");
        }

        if (data.getBefore() != null) {
            map.putDouble("before", data.getBefore().getTime());
        } else {
            map.putNull("before");
        }

        return map;
    }
}
