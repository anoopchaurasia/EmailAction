package com.action.email.realm.reactmodule;

import com.action.email.realm.model.Message;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import com.action.email.realm.model.Label;
import com.action.email.realm.service.LabelService;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import java.util.List;
import java.util.Objects;

public class LabelModule extends ReactContextBaseJavaModule {
    public LabelModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "LabelModule";
    }

    @ReactMethod
    public void create(ReadableMap labelMap, Promise promise) {
        try {

            Label label = Label.fromMap(labelMap);
            LabelService.create(label);
            promise.resolve("Label created");
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("CREATE_LABEL_ERROR", e);
        }
    }

    @ReactMethod
    public void updateById(String id, String newName, Promise promise) {
        try {
            LabelService.updateNameById(id, newName);
            promise.resolve("Label updated");
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("UPDATE_LABEL_ERROR", e);
        }
    }

    @ReactMethod
    public void deleteById(String id, Promise promise) {
        try {
            LabelService.deleteById(id);
            promise.resolve("Label deleted");
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("DELETE_LABEL_ERROR", e);
        }
    }

    @ReactMethod
    public void getById(String id, Promise promise) {
        try {
            Label label = LabelService.getById(id);
            if (label != null) {
                promise.resolve(label.toMap());
            } else {
                promise.resolve(null);
            }
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("GET_LABEL_ERROR", e);
        }
    }

    @ReactMethod
    public void readAll(Promise promise) {
        try {
            List<Label> labels = LabelService.readAll();
            WritableArray result = Arguments.createArray();
            for (Label label : labels) result.pushMap(label.toMap());
            promise.resolve(result);
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("READ_ALL_LABELS_ERROR", e);
        }
    }

    @ReactMethod
    public void deleteAll(Promise promise) {
        try {
            LabelService.deleteAll();
            promise.resolve("All labels deleted");
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("DELETE_ALL_LABELS_ERROR", e);
        }
    }
}
