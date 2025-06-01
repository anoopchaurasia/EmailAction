package com.action.email.realm.model;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

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

    public static Label fromMap(ReadableMap labelMap) {

        Label label = new Label();
        label.setId(labelMap.getString("id"));
        label.setName(labelMap.getString("name"));
        label.setType(labelMap.getString("type"));
        label.setMessagesTotal(labelMap.getInt("total"));
        label.setMessagesUnread(labelMap.getInt("messagesUnread"));
        return label;
    }

    public WritableMap toMap() {
        WritableMap map = Arguments.createMap();
        map.putString("id", this.getId());
        map.putString("name", this.getName());
        map.putString("type", this.getType());
        map.putInt("messagesTotal", this.getMessagesTotal() != null ? this.getMessagesTotal() : 0);
        map.putInt("messagesUnread", this.getMessagesUnread() != null ? this.getMessagesUnread() : 0);
        return map;
    }

}
