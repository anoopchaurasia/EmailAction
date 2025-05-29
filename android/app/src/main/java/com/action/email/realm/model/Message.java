package com.action.email.realm.model;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;
import io.realm.annotations.Index;
import io.realm.RealmList;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;


public class Message extends RealmObject {
    @PrimaryKey
    private String message_id;

    private String subject;
    private String sender_name;
    @Index
    private String sender;
    @Index
    private String sender_domain;
    @Index
    private Date date;
    private Date created_at;
    private RealmList<String> labels;
    private RealmList<Attachment> attachments;
    @Index
    private boolean has_attachement = false;

    public Message(String messageId) {
        this.message_id = messageId;
    }
    public Message() {
    }


    // Getters and Setters
    public String getMessage_id() {
        return message_id;
    }
    public void setMessage_id(String message_id) {
        this.message_id = message_id;
    }
    public String getSubject() {
        return subject;
    }
    public void setSubject(String subject) {
        this.subject = subject;
    }
    public String getSender_name() {
        return sender_name;
    }

    public void setSender_name(String sender_name) {
        this.sender_name = sender_name;
    }
    public String getSender() {
        return sender;
    }
    public void setSender(String sender) {
        this.sender = sender;
    }
    public String getSender_domain() {
        return sender_domain;
    }
    public void setSender_domain(String sender_domain) {
        this.sender_domain = sender_domain;
    }
    public Date getDate() {
        return date;
    }
    public void setDate(Date date) {
        this.date = date;
    }
    public Date getCreated_at() {
        return created_at;
    }
    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }
    public RealmList<String> getLabels() {
        return labels;
    }
    public void setLabels(RealmList<String> labels) {
        this.labels = labels;
    }
    public RealmList<Attachment> getAttachments() {
        return attachments;
    }
    public void setAttachments(RealmList<Attachment> attachments) {
        this.attachments = attachments;
    }
    public boolean isHas_attachement() {
        return has_attachement;
    }
    public void setHas_attachement(boolean has_attachement) {
        this.has_attachement = has_attachement;
    }

    public static Message fromMap(ReadableMap map) {
        Message agg = new Message();
        agg.setSender(map.getString("sender"));
        agg.setSender_domain(map.getString("sender_domain"));
        agg.setMessage_id(map.getString("message_id"));
        agg.setSubject(map.getString("subject"));
        agg.setSender_name(map.getString("sender_name"));
        agg.setDate(new Date(map.getString("date")));
        if (map.hasKey("labels")) {
            RealmList<String> labels = new RealmList<>();
            for (int i = 0; i < map.getArray("labels").size(); i++) {
                labels.add(map.getArray("labels").getString(i));
            }
            agg.setLabels(labels);
        }
//        if (map.hasKey("attachments")) {
//            RealmList<Attachment> attachments = new RealmList<>();
//            for (int i = 0; i < map.getArray("attachments").size(); i++) {
//                attachments.add(Attachment.fromMap(map.getArray("attachments").getMap(i)));
//            }
//            agg.setAttachments(attachments);
//        }
        boolean arg = map.hasKey("has_attachement") && map.getBoolean("has_attachement");

        agg.setHas_attachement(arg);
        // set other fields as needed
        return agg;
    }

    public WritableMap toMap() {
        WritableMap map = Arguments.createMap();
        map.putString("message_id", getMessage_id());
        map.putString("sender", getSender());
        map.putString("sender_domain", getSender_domain());
        map.putString("date", getDate().toString());
        map.putString("subject", getSubject());
        map.putArray("labels", Arguments.fromList(getLabels()));
        map.putBoolean("has_attachement",
                isHas_attachement());
        map.putString("sender_name", getSender_name());

//        List<Map<String, Object>> attachmentList = new ArrayList<>();
//        if (attachments != null) {
//            for (Attachment a : attachments) {
//                attachmentList.add(a.toMap());  // Ensure `Attachment.toMap()` exists
//            }
//        }
//        map.put("attachments", attachmentList);
     //   map.putArray("attachments", Arguments.fromArray(getAttachments()));
        map.putString("created_at", getCreated_at().toString());
        return map;
    }


}


