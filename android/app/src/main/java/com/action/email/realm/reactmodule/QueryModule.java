package com.action.email.realm.reactmodule;


import com.action.email.realm.model.Label;
import com.action.email.realm.model.Query;
import com.action.email.realm.service.QueryService;
import com.facebook.react.bridge.*;
import java.util.List;

public class QueryModule extends ReactContextBaseJavaModule {

    private final QueryService queryService;

    public QueryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.queryService = new QueryService(reactContext);
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
            promise.reject("CREATE_QUERY_ERROR", e);
        }
    }

    @ReactMethod
    public void deleteAll(Promise promise) {
        try {
            queryService.deleteAll();
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("DELETE_ALL_ERROR", e);
        }
    }

    @ReactMethod
    public void update(ReadableMap query, Promise promise) {
        try {
            queryService.update(Query.fromMap(query));
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("UPDATE_QUERY_ERROR", e);
        }
    }

    @ReactMethod
    public void delete(String id, Promise promise) {
        try {
            queryService.delete(id);
            promise.resolve(null);
        } catch (Exception e) {
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
            promise.reject("GET_ALL_QUERIES_ERROR", e);
        }
    }
}
