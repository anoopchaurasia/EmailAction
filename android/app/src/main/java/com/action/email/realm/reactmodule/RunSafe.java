package com.action.email.realm.reactmodule;

import com.action.email.realm.config.RealmManager;
import com.facebook.react.bridge.Promise;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class RunSafe {
    private static final ExecutorService executor = Executors.newFixedThreadPool(3);

    static void runSafelyWith(SafeTask task, Promise promise) {
        executor.execute(() -> {
            try {
                task.run();
            } catch (Exception e) {
                promise.reject("ERR", e.getMessage(), e);
                FirebaseCrashlytics.getInstance().recordException(e);
            } finally {
                RealmManager.closeRealm();
            }
        });
    }
}

@FunctionalInterface
 interface SafeTask {
    void run() throws Exception;
}
