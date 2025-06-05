package com.action.email.realm.reactmodule;

import com.action.email.data.ProcessRule;
import com.action.email.realm.model.Activity;
import com.action.email.realm.service.ActivityService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import java.util.List;

public class ActivityModule extends ReactContextBaseJavaModule {

    public ActivityModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ActivityModule";
    }

    @ReactMethod
    public void createObject(ReadableMap map, Promise promise) {
        try {
            Activity activity = Activity.fromMap(map);
            Activity result = ActivityService.createObject(activity);
            NativeNotifierModule.sendEvent(NativeNotifierModule.NEW_EMAIL_RULE_CREATED, result.getId());
            promise.resolve(result.toMap());
            ProcessRule.takeAction(result, this.getReactApplicationContext().getApplicationContext());
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("CREATE_ERROR", e);
        }
    }

    @ReactMethod
    public void deleteAll(Promise promise) {
        try {
            ActivityService.deleteAll();
            NativeNotifierModule.sendEvent(NativeNotifierModule.EMAIL_RULE_DELETED, "");
            promise.resolve(true);
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("DELETE_ALL_ERROR", e);
        }
    }

    @ReactMethod
    public void getAll(Promise promise) {
        try {
            List<Activity> activities = ActivityService.getAll();
            WritableArray array = Arguments.createArray();
            for (Activity activity : activities) {
                array.pushMap(activity.toMap());
            }
            promise.resolve(array);
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("GET_ALL_ERROR", e);
        }
    }

    @ReactMethod
    public void getNoCompleted(Promise promise) {
        try {
            List<Activity> activities = ActivityService.getNoCompleted();
            WritableArray array = Arguments.createArray();
            for (Activity activity : activities) {
                array.pushMap(activity.toMap());
            }
            promise.resolve(array);
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("GET_NO_COMPLETED_ERROR", e);
        }
    }

    @ReactMethod
    public void getBySender(String sender, Promise promise) {
        try {
            List<Activity> activities = ActivityService.getBySender(sender);
            WritableArray array = Arguments.createArray();
            for (Activity activity : activities) {
                array.pushMap(activity.toMap());
            }
            promise.resolve(array);
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("GET_BY_SENDER_ERROR", e);
        }
    }

    @ReactMethod
    public void deleteObjectById(String id, Promise promise) {
        try {
            ActivityService.deleteObjectById(id);
            NativeNotifierModule.sendEvent(NativeNotifierModule.EMAIL_RULE_DELETED, "");
            promise.resolve(true);
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("DELETE_BY_ID_ERROR", e);
        }
    }

    @ReactMethod
    public void updateObjectById(String id, ReadableMap map, Promise promise) {
        try {
            Activity activity = Activity.fromMap(map);
            ActivityService.updateObjectById(id, activity);
            promise.resolve(true);
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("UPDATE_ERROR", e);
        }
    }
}

