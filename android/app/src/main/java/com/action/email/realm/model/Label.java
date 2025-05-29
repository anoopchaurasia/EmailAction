package com.action.email.realm.model;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;
import io.realm.annotations.RealmClass;

@RealmClass
public class Label extends RealmObject {
    @PrimaryKey
    private String id;

    private String name;
    private String type;
    private Integer messagesTotal;
    private Integer messagesUnread;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getMessagesTotal() { return messagesTotal; }
    public void setMessagesTotal(Integer messagesTotal) { this.messagesTotal = messagesTotal; }

    public Integer getMessagesUnread() { return messagesUnread; }
    public void setMessagesUnread(Integer messagesUnread) { this.messagesUnread = messagesUnread; }

    
}
