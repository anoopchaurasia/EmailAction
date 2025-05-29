package com.action.email.realm.config;

import android.content.Context;

import io.realm.Realm;
import io.realm.RealmConfiguration;

public class RealmManager {
    private static RealmConfiguration realmConfig;

    public static void initRealm(Context context) {
        Realm.init(context);
        realmConfig = new RealmConfiguration.Builder()
                .name("emailaction.realm")
                .schemaVersion(20)
                .deleteRealmIfMigrationNeeded()
                .build();
        Realm.setDefaultConfiguration(realmConfig);
    }

    public static Realm getRealmInstance() {
        return Realm.getDefaultInstance();
    }
}
