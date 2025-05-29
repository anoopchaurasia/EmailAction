package com.action.email.realm.service;

import com.action.email.realm.config.RealmManager;
import com.action.email.realm.model.Label;

import io.realm.Realm;
import io.realm.RealmConfiguration;
import io.realm.RealmResults;

import java.util.HashMap;
import java.util.Map;

public class LabelService {
    private Map<String, String> idNameMap = new HashMap<>();

    public LabelService() {
        getMap(); // preload
    }

    public void deleteById(String id) {
        Realm realm = RealmManager.getRealmInstance();
        realm.executeTransaction(r -> {
            Label label = r.where(Label.class).equalTo("id", id).findFirst();
            if (label != null) {
                label.deleteFromRealm();
            }
        });
        getMap();
    }

    public void updateById(String id, String newName) {
        Realm realm = RealmManager.getRealmInstance();
        realm.executeTransaction(r -> {
            Label label = r.where(Label.class).equalTo("id", id).findFirst();
            if (label != null) {
                label.setName(newName);
            }
        });
        getMap();
    }

    public Label getById(String id) {
        Realm realm = RealmManager.getRealmInstance();
        return realm.where(Label.class).equalTo("id", id).findFirst();
    }

    public Label create(Label labelData) {
        Realm realm = RealmManager.getRealmInstance();
        realm.executeTransaction(r -> r.insert(labelData));
        getMap();
        return labelData;
    }

    public RealmResults<Label> readAll() {
        Realm realm = RealmManager.getRealmInstance();
        return realm.where(Label.class).findAll();
    }

    public Map<String, String> getMap() {
        RealmResults<Label> labels = readAll();
        Map<String, String> map = new HashMap<>();
        for (Label label : labels) {
            map.put(label.getId(), label.getName());
        }
        idNameMap = map;
        return idNameMap;
    }

    public String getNameById(String id) {
        return idNameMap.get(id);
    }

    public void deleteAll() {
        Realm realm = RealmManager.getRealmInstance();
        realm.executeTransaction(r -> {
            r.delete(Label.class);
        });
        idNameMap.clear();
    }

    public void close() {
        Realm realm = RealmManager.getRealmInstance();
        if (!realm.isClosed()) realm.close();
    }
}
