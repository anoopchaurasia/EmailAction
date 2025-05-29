package com.action.email.realm.model;

import io.realm.RealmList;
import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;
import io.realm.annotations.RealmClass;

@RealmClass
public class Query extends RealmObject {
    @PrimaryKey
    private String id;

    private String name;
    private String pdf_password;
    private RealmList<String> message_ids;
    private String nextPageToken;
    private boolean completed;
    private QueryData query;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPdf_password() { return pdf_password; }
    public void setPdf_password(String pdf_password) { this.pdf_password = pdf_password; }

    public RealmList<String> getMessage_ids() { return message_ids; }
    public void setMessage_ids(RealmList<String> message_ids) { this.message_ids = message_ids; }

    public String getNextPageToken() { return nextPageToken; }
    public void setNextPageToken(String nextPageToken) { this.nextPageToken = nextPageToken; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public QueryData getQuery() { return query; }
    public void setQuery(QueryData query) { this.query = query; }
}
