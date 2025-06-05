package com.action.email.realm.reactmodule;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class NativeNotifierModule extends ReactContextBaseJavaModule {
    public static final String NEW_MESSAGE_BATCH_ADDED = "new_message_batch_added";
    public static final String NEW_EMAIL_RULE_CREATED = "new_email_rule_created";
    public static final String EMAIL_RULE_DELETED = "email_rule_deleted";
    private static ReactApplicationContext reactContext;
    public static final String NEW_MESSAGE_ARRIVED = "new_message_arrived";
    public NativeNotifierModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "NativeNotifier";
    }

    // Emit event to JS
    public static void sendEvent(String eventName, String message) {
        if (reactContext != null && reactContext.hasActiveCatalystInstance()) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, message);
        }
    }
}
