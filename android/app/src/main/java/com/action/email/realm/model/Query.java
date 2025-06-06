package com.action.email.realm.model;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

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

    public static Query fromMap(ReadableMap map) {
        Query query = new Query();

        query.setId(map.getString("id"));

        if (map.hasKey("name") && !map.isNull("name")) {
            query.setName(map.getString("name"));
        }

        if (map.hasKey("pdf_password") && !map.isNull("pdf_password")) {
            query.setPdf_password(map.getString("pdf_password"));
        }

        if (map.hasKey("message_ids") && !map.isNull("message_ids")) {
            ReadableArray ids = map.getArray("message_ids");
            RealmList<String> messageIds = new RealmList<>();
            for (int i = 0; i < ids.size(); i++) {
                messageIds.add(ids.getString(i));
            }
            query.setMessage_ids(messageIds);
        }

        if (map.hasKey("nextPageToken") && !map.isNull("nextPageToken")) {
            query.setNextPageToken(map.getString("nextPageToken"));
        }

        if (map.hasKey("completed") && !map.isNull("completed")) {
            query.setCompleted(map.getBoolean("completed"));
        }

        if (map.hasKey("query") && !map.isNull("query")) {
            ReadableMap queryMap = map.getMap("query");
            query.setQuery(QueryData.fromMap(queryMap));
        }

        return query;
    }

    public WritableMap toMap( ) {
        WritableMap map = Arguments.createMap();
        Query query = this;
        map.putString("id", query.getId());
        map.putString("name", query.getName());
        map.putString("pdf_password", query.getPdf_password());

        WritableArray messageIds = Arguments.createArray();
        if (query.getMessage_ids() != null) {
            for (String id : query.getMessage_ids()) {
                messageIds.pushString(id);
            }
        }
        map.putArray("message_ids", messageIds);

        map.putString("nextPageToken", query.getNextPageToken());
        map.putBoolean("completed", query.isCompleted());

        if (query.getQuery() != null) {
            map.putMap("query", query.getQuery().toMap() );
        }

        return map;
    }



}
