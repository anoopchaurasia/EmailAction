package com.action.email.realm.reactmodule;


import android.util.Log;

import com.action.email.data.MessageList;
import com.action.email.google.GmailEmailFetcher;
import com.action.email.google.GmailMessageFetcher;
import com.action.email.realm.model.Label;
import com.action.email.realm.model.Message;
import com.action.email.realm.model.Query;
import com.action.email.realm.service.QueryService;
import com.facebook.react.bridge.*;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import java.util.List;
import java.util.Map;

public class QueryModule extends ReactContextBaseJavaModule {

    private final QueryService queryService;
    private static final String TAG = "QueryModule";
    public QueryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.queryService = new QueryService();
    }

    @Override
    public String getName() {
        return "QueryModule";
    }

    @ReactMethod
    public void create(ReadableMap query, Promise promise) {
        try {

            queryService.create(Query.fromMap(query));
            promise.resolve(null);
        } catch (Exception e) {
            FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("CREATE_QUERY_ERROR", e);
        }
    }

    @ReactMethod
    public void deleteAll(Promise promise) {
        try {
            queryService.deleteAll();
            promise.resolve(null);
        } catch (Exception e) {
            FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("DELETE_ALL_ERROR", e);
        }
    }

    @ReactMethod
    public void update(ReadableMap query, Promise promise) {
        try {
            queryService.update(Query.fromMap(query));
            promise.resolve(null);
        } catch (Exception e) {
            FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("UPDATE_QUERY_ERROR", e);
        }
    }

    @ReactMethod
    public void delete(String id, Promise promise) {
        try {
            queryService.delete(id);
            promise.resolve(null);
        } catch (Exception e) {
            FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("DELETE_QUERY_ERROR", e);
        }
    }

    @ReactMethod
    public void getAll(Promise promise) {
        try {
            List<Query> queries = queryService.getAll();
            WritableArray result = Arguments.createArray();
            for (Query query : queries) result.pushMap(query.toMap());
            promise.resolve(result);
        } catch (Exception e) {
            FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("GET_ALL_QUERIES_ERROR", e);
        }
    }

    @ReactMethod
    public void fetchMessages(String query, String pageToken, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            Log.d(TAG, "query: "+ query + " pagetoken: "+ (pageToken==null));
            GmailEmailFetcher gmailEmailFetcher = new GmailEmailFetcher(getReactApplicationContext().getApplicationContext());
            GmailMessageFetcher gmailMessageFetcher = new GmailMessageFetcher(getReactApplicationContext().getApplicationContext());
            MessageList messageList = gmailEmailFetcher.getMessageIDs(pageToken, query);
            List<Message> messages = gmailMessageFetcher.retryBatch(messageList.getMessageIds());
            WritableArray array = Arguments.createArray();
            for (Message msg : messages) array.pushMap(msg.toMap());
            WritableMap map = Arguments.createMap();
            map.putString("nextPageToken", messageList.getPageToken());
            map.putArray("messages", array);
            promise.resolve(map);
            }, promise);

    }
}
