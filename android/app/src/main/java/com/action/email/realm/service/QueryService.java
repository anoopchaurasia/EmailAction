package com.action.email.realm.service;

import com.action.email.realm.model.Query;
import android.content.Context;
import android.util.Log;

import com.action.email.realm.config.RealmManager;
import com.action.email.realm.model.QueryData;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import io.realm.Realm;
import io.realm.RealmResults;

public class QueryService {

    private static final String TAG = "QueryService" ;

    public QueryService(Context context) {
        Realm.init(context);

    }

    public boolean create(Query query) {
        try {
            Realm realm = RealmManager.getRealm();
            if (query.getId() == null || query.getId().isEmpty()) {
                query.setId(UUID.randomUUID().toString());

            }
            Log.d(TAG, "query id: "+ query.getId()+ " new: "+ UUID.randomUUID().toString());
            realm.executeTransaction(r -> r.insert(query));
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean update(Query query) {
        try {
            Realm realm = RealmManager.getRealm();
            if (query.getId() == null || query.getId().isEmpty()) {
                query.setId(UUID.randomUUID().toString());
            }
            realm.executeTransaction(r -> r.insertOrUpdate(query));
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean delete(String id) {
        try {
            Realm realm = RealmManager.getRealm();
            realm.executeTransaction(r -> {
                Query query = r.where(Query.class).equalTo("id", id).findFirst();
                if (query != null) {
                    query.deleteFromRealm();
                }
            });
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void deleteAll() {
        Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {
            r.delete(Query.class);
            r.delete(QueryData.class);
        });
    }

    public List<Query> getAll() {
        Realm realm = RealmManager.getRealm();
        RealmResults<Query> results = realm.where(Query.class).findAll();
        return realm.copyFromRealm(results);
    }

    public String getQueryString(QueryData query) {
        List<String> parts = new ArrayList<>();
        parts.add(setValue("from", query.getFrom(), false));
        parts.add(setValue("to", query.getTo(), false));
        parts.add(setValue("subject", query.getSubject(), false));
        parts.add(query.getBody() != null ? query.getBody() : "");
        parts.add(query.getNotHas() != null ? "-{" + query.getNotHas() + "}" : "");
        parts.add(setValue("has", query.getHas() != null && query.getHas() ? "attachment" : "", true));
        if (query.getAfter() != null)
            parts.add(setValue("after", formatDate(query.getAfter()), true));
        if (query.getBefore() != null)
            parts.add(setValue("before", formatDate(query.getBefore()), true));

        return String.join(" ", parts).trim();
    }

    private String setValue(String key, String value, boolean rawValue) {
        if (value == null || value.isEmpty()) return "";
        return rawValue ? key + ":" + value : key + ":(" + value + ")";
    }

    private String formatDate(java.util.Date date) {
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy/MM/dd");
        return sdf.format(date);
    }
}
