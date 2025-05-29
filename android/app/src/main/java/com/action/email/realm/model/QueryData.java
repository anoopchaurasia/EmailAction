package com.action.email.realm.model;


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
}
