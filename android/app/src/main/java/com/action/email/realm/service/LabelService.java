package com.action.email.realm.service;

import com.action.email.realm.config.RealmManager;
import com.action.email.realm.model.Label;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import io.realm.Realm;
import io.realm.RealmConfiguration;
import io.realm.RealmList;
import io.realm.RealmResults;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LabelService {

    public LabelService() {
        // preload
    }


    public static void updateNameById(String id, String newName) {
        Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {
            Label label = r.where(Label.class).equalTo("id", id).findFirst();
            if (label != null) {
                label.setName(newName);
            }
        });
    }

    public static void deleteById(String id) {
        Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {
            Label label = r.where(Label.class).equalTo("id", id).findFirst();
            if (label != null) {
                label.deleteFromRealm();
            }
        });
    }

    public static void updateById(String id, String newName) {
        Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {
            Label label = r.where(Label.class).equalTo("id", id).findFirst();
            if (label != null) {
                label.setName(newName);
            }
        });
    }

    public static Label getById(String id) {
        Realm realm = RealmManager.getRealm();
        return realm.where(Label.class).equalTo("id", id).findFirst();
    }

    public static Label create(Label labelData) {
        Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> r.insert(labelData));
        return labelData;
    }

    public static List<Label> readAll() {
        Realm realm = RealmManager.getRealm();
        return realm.where(Label.class).findAll();
    }


    public static void deleteAll() {
        Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {
            r.delete(Label.class);
        });
    }

    public static void close() {
        Realm realm = RealmManager.getRealm();
        if (!realm.isClosed()) realm.close();
    }


}
