package com.action.email.realm.reactmodule;

import androidx.annotation.NonNull;

import com.action.email.realm.model.MessageAggregate;
import com.action.email.realm.service.MessageAggregateService;
import com.facebook.react.bridge.*;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import java.util.ArrayList;
import java.util.List;

public class MessageAggregateModule extends ReactContextBaseJavaModule {

    public MessageAggregateModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "MessageAggregateModule";
    }

    @ReactMethod
    public void create(ReadableMap map) {
        MessageAggregate data = MessageAggregate.fromMap(map); // You must implement this
        MessageAggregateService.create(data);
    }

    @ReactMethod
    public void update(ReadableMap map) {
        MessageAggregate data = MessageAggregate.fromMap(map);
        MessageAggregateService.update(data);
    }

    @ReactMethod
    public void deleteAll() {
        MessageAggregateService.deleteAll();
    }

    @ReactMethod
    public void deleteBySender(String senderId) {
        MessageAggregateService.deleteBySender(senderId);
    }

    @ReactMethod
    public void deleteBySenders(ReadableArray senderIds) {
        List<String> ids = new ArrayList<>();
        for (int i = 0; i < senderIds.size(); i++) {
            ids.add(senderIds.getString(i));
        }
        MessageAggregateService.deleteBySenders(ids);
    }

    @ReactMethod
    public void deleteBySubDomain(ReadableArray subdomains) {
        List<String> domains = new ArrayList<>();
        for (int i = 0; i < subdomains.size(); i++) {
            domains.add(subdomains.getString(i));
        }
        MessageAggregateService.deleteBySubDomain(domains);
    }

    @ReactMethod
    public void readMessage(Promise promise) {
        try {
            List<MessageAggregate> list = MessageAggregateService.readMessage();
            WritableArray result = Arguments.createArray();
            for (MessageAggregate item : list) {
                result.pushMap(item.toMap()); // You must implement this
            }
            promise.resolve(result);
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("READ_ERROR", e);
        }
    }

    @ReactMethod
    public void readAll(Promise promise) {
        try {
            List<MessageAggregate> list = MessageAggregateService.readAll();
            WritableArray result = Arguments.createArray();
            for (MessageAggregate item : list) {
                result.pushMap(item.toMap()); // You must implement this
            }
            promise.resolve(result);
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("READ_ALL_ERROR", e);
        }
    }

    @ReactMethod
    public void readBySender(String sender, Promise promise) {
        try {
            MessageAggregate agg = MessageAggregateService.readBySender(sender);
            promise.resolve(agg != null ? agg.toMap() : null);
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("READ_SENDER_ERROR", e);
        }
    }

    @ReactMethod
    public void count(Promise promise) {
        try {
            int total = MessageAggregateService.count();
            promise.resolve(total);
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("COUNT_ERROR", e);
        }
    }

    @ReactMethod
    public void updateCount(ReadableMap map, Promise promise) {
        try {
            MessageAggregate data = MessageAggregate.fromMap(map);
            MessageAggregate result = MessageAggregateService.updateCount(data);
            promise.resolve(result.toMap());
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            promise.reject("UPDATE_COUNT_ERROR", e);
        }
    }


}
