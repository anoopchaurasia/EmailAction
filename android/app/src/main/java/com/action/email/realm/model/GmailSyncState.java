package com.action.email.realm.model;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;

public class GmailSyncState extends RealmObject {
    @PrimaryKey
    private String id; // fixed ID
    private String value;

    // Getters & Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}