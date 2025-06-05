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
        RunSafe.runSafelyWith(() -> {
            Label label = Label.fromMap(labelMap);
            LabelService.create(label);
            promise.resolve("Label created");
        }, promise);
    }

    @ReactMethod
    public void updateById(String id, String newName, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            LabelService.updateNameById(id, newName);
            promise.resolve("Label updated");
        }, promise);
    }

    @ReactMethod
    public void deleteById(String id, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            LabelService.deleteById(id);
            promise.resolve("Label deleted");
        }, promise);
    }

    @ReactMethod
    public void getById(String id, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            Label label = LabelService.getById(id);
            if (label != null) {
                promise.resolve(label.toMap());
            } else {
                promise.resolve(null);
            }
        }, promise);
    }

    @ReactMethod
    public void readAll(Promise promise) {
        RunSafe.runSafelyWith(() -> {
            List<Label> labels = LabelService.readAll();
            WritableArray result = Arguments.createArray();
            for (Label label : labels) result.pushMap(label.toMap());
            promise.resolve(result);
        }, promise);
    }

    @ReactMethod
    public void deleteAll(Promise promise) {
        RunSafe.runSafelyWith(() -> {
            LabelService.deleteAll();
            promise.resolve("All labels deleted");
        }, promise);
    }
}
