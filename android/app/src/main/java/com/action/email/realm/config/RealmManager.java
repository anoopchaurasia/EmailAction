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


    private static final ThreadLocal<Realm> threadLocalRealm = new ThreadLocal<>();

    public static Realm getRealm() {
        Realm realm = threadLocalRealm.get();
        if (realm == null || realm.isClosed()) {
            realm = Realm.getDefaultInstance();
            threadLocalRealm.set(realm);
        }
        return realm;
    }

    public static void closeRealm() {
        Realm realm = threadLocalRealm.get();
        if (realm != null && !realm.isClosed()) {
            realm.close();
            threadLocalRealm.remove();
        }
    }
}
