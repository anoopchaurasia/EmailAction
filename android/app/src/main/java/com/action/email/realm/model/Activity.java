package com.action.email.realm.model;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;
import io.realm.annotations.Index;
import io.realm.RealmList;
import java.util.Date;

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
}
