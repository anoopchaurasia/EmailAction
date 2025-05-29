package com.action.email.realm.model;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;
import io.realm.annotations.Index;
import io.realm.RealmList;
import java.util.Date;


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

}
