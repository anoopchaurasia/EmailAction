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


     private static Realm realmInstance;

    public static Realm getRealm() {
        if (realmInstance == null || realmInstance.isClosed()) {
            realmInstance = Realm.getDefaultInstance();
        }
        return realmInstance;
    }

    public static void closeRealm() {
        if (realmInstance != null && !realmInstance.isClosed()) {
            realmInstance.close();
        }
    }
}
