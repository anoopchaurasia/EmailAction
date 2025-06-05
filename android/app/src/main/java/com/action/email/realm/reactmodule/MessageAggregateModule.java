package com.action.email.realm.reactmodule;

import androidx.annotation.NonNull;

import com.action.email.realm.config.RealmManager;
import com.action.email.realm.model.Message;
import com.action.email.realm.model.MessageAggregate;
import com.action.email.realm.service.MessageAggregateService;
import com.action.email.realm.service.MessageService;
import com.facebook.react.bridge.*;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

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
    public void create(ReadableMap map, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            MessageAggregate data = MessageAggregate.fromMap(map); // You must implement this
            MessageAggregateService.create(data);
        }, promise);
    }

    @ReactMethod
    public void update(ReadableMap map, Promise promise) {

        RunSafe.runSafelyWith(() -> {
            MessageAggregate data = MessageAggregate.fromMap(map);
            MessageAggregateService.update(data);
        }, promise);
    }

    @ReactMethod
    public void deleteAll(Promise promise) {
        RunSafe.runSafelyWith(() -> {
            MessageAggregateService.deleteAll();
        }, promise);
    }

    @ReactMethod
    public void deleteBySender(String senderId, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            MessageAggregateService.deleteBySender(senderId);
        }, promise);

    }

    @ReactMethod
    public void deleteBySenders(ReadableArray senderIds, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            List<String> ids = new ArrayList<>();

            for (int i = 0; i < senderIds.size(); i++) {
                ids.add(senderIds.getString(i));
            }
            MessageAggregateService.deleteBySenders(ids);
        }, promise);
    }

    @ReactMethod
    public void deleteBySubDomain(ReadableArray subdomains, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            List<String> domains = new ArrayList<>();

            for (int i = 0; i < subdomains.size(); i++) {
                domains.add(subdomains.getString(i));
            }
            MessageAggregateService.deleteBySubDomain(domains);
        }, promise);
    }

    @ReactMethod
    public void readMessage(Promise promise) {
        RunSafe.runSafelyWith(() -> {
            List<MessageAggregate> list = MessageAggregateService.readMessage();
            WritableArray result = Arguments.createArray();
            for (MessageAggregate item : list) {
                result.pushMap(item.toMap()); // You must implement this
            }
            promise.resolve(result);
        }, promise);
    }

    @ReactMethod
    public void readAll(Promise promise) {
        RunSafe.runSafelyWith(() -> {
            List<MessageAggregate> list = MessageAggregateService.readAll();
            WritableArray result = Arguments.createArray();
            for (MessageAggregate item : list) {
                result.pushMap(item.toMap()); // You must implement this
            }
            promise.resolve(result);
        }, promise);
    }

    @ReactMethod
    public void readBySender(String sender, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            MessageAggregate agg = MessageAggregateService.readBySender(sender);
            promise.resolve(agg != null ? agg.toMap() : null);
        }, promise);
    }

    @ReactMethod
    public void count(Promise promise) {
        RunSafe.runSafelyWith(() -> {
            int total = MessageAggregateService.count();
            promise.resolve(total);
        }, promise);
    }

    @ReactMethod
    public void updateCount(ReadableMap map, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            MessageAggregate data = MessageAggregate.fromMap(map);
            MessageAggregate result = MessageAggregateService.updateCount(data);
            promise.resolve(result.toMap());
        }, promise);
    }

    @ReactMethod
    public void getPage(String sender, int page, int pageSize, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            List<MessageAggregate> messageAggregates = MessageAggregateService.getPage(sender, page, pageSize);

            WritableArray array = Arguments.createArray();
            for (MessageAggregate msga : messageAggregates) array.pushMap(msga.toMap());
            promise.resolve(array);
        }, promise);
    }

    @ReactMethod
    public void getPageForDomain(String sender, int page, int pageSize, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            List<Map<MessageAggregate, Integer>> messageAggregates = MessageAggregateService.getPageForDomain(sender, page, pageSize);
            WritableArray array = Arguments.createArray();
            for (Map<MessageAggregate, Integer> map : messageAggregates) {
                for (Map.Entry<MessageAggregate, Integer> entry : map.entrySet()) {
                    WritableMap messageAggregate = entry.getKey().toMap();
                    messageAggregate.putInt("aggregate_count", entry.getValue());
                    array.pushMap(messageAggregate);
                }
            }
            promise.resolve(array);
        }, promise);

    }

    @ReactMethod
    public void getCountByDomain(Promise promise) {
        RunSafe.runSafelyWith(() -> {
            int total = MessageAggregateService.getCountByDomain();
            promise.resolve(total);
        }, promise);
    }
}
