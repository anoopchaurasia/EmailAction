package com.action.email.realm.reactmodule;

import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;

import com.action.email.realm.config.RealmManager;
import com.action.email.realm.model.Attachment;
import com.action.email.realm.model.Message;
import com.action.email.realm.service.MessageService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

public class MessageModule extends ReactContextBaseJavaModule {

    private static final String TAG = "MessageModule";

    public MessageModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "MessageModule";
    }

    @ReactMethod
    public void create(ReadableMap messageMap, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            Message message = Message.fromMap(messageMap);
            MessageService.create(message);
        }, promise);
    }

    @ReactMethod
    public void readMessage(Promise promise) {

        RunSafe.runSafelyWith(() -> {
            List<Message> messages = MessageService.readMessage();
            WritableArray result = Arguments.createArray();
            for (Message msg : messages) result.pushMap(msg.toMap());
            promise.resolve(result);
        }, promise);
    }

    @ReactMethod
    public void readAll(Promise promise) {
        RunSafe.runSafelyWith(() -> {
            List<Message> messages = MessageService.readAll();


            WritableArray result = Arguments.createArray();
            for (Message msg : messages) result.pushMap(msg.toMap());
            promise.resolve(result);
        }, promise);
    }

    @ReactMethod
    public void getCount(Promise promise) {
        RunSafe.runSafelyWith(() -> {
            Integer count = MessageService.getCount();
            promise.resolve(count);
        }, promise);


    }

    @ReactMethod
    public void readById(String id, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            Message msg = MessageService.readById(id);
            promise.resolve(msg != null ? msg.toMap() : null);
        }, promise);
    }

    @ReactMethod
    public void update(ReadableMap messageMap, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            Message message = Message.fromMap(messageMap);
            MessageService.update(message);
        }, promise);
    }

    @ReactMethod
    public void delete(String id, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            Message msg = MessageService.readById(id);

            if (msg != null) MessageService.delete(msg);
        }, promise);
    }

    @ReactMethod
    public void checkMessageId(String id, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            promise.resolve(MessageService.checkMessageId(id));
        }, promise);
    }

    @ReactMethod
    public void getCountBySenderDomain(Promise promise) {
        RunSafe.runSafelyWith(() -> {
            List<Map<String, Object>> counts = MessageService.getCountBySenderDomain();

            WritableArray array = Arguments.createArray();
            for (Map<String, Object> map : counts) {
                WritableMap entry = Arguments.createMap();
                entry.putString("k", (String) map.get("k"));
                entry.putInt("v", (int) map.get("v"));
                array.pushMap(entry);
            }
            promise.resolve(array);
        }, promise);
    }

    @ReactMethod
    public void getCountBySender(String sender, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            List<Message> messages = MessageService.getCountBySender(sender);

            WritableArray array = Arguments.createArray();
            for (Message msg : messages) array.pushMap(msg.toMap());
            promise.resolve(array);
        }, promise);
    }

    @ReactMethod
    public void getBySender(String sender, int page, int pageSize, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            List<Message> messages = MessageService.getBySender(sender, page, pageSize);

            WritableArray array = Arguments.createArray();
            for (Message msg : messages) array.pushMap(msg.toMap());
            promise.resolve(array);
        }, promise);
    }

    @ReactMethod
    public void getByDomain(String domain, int page, int pageSize, Promise
            promise) {
        RunSafe.runSafelyWith(() -> {
            List<Message> messages = MessageService.getByDomain(domain, page, pageSize);

            WritableArray array = Arguments.createArray();
            for (Message msg : messages) array.pushMap(msg.toMap());
            promise.resolve(array);
        }, promise);
    }

    @ReactMethod
    public void getById(String messageId, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            Message msg = MessageService.getById(messageId);

            promise.resolve(msg != null ? msg.toMap() : null);
        }, promise);
    }

    @ReactMethod
    public void fetchMessageIdBySenders(ReadableArray senders, Promise
            promise) {
        RunSafe.runSafelyWith(() -> {
            List<String> list = new ArrayList<>();

            for (int i = 0; i < senders.size(); i++)
                list.add(senders.getString(i));
            List<Map<String, Object>> result = MessageService.fetchMessageIdBySenders(list);
            WritableArray array = Arguments.createArray();
            for (Map<String, Object> map : result) {
                WritableMap entry = Arguments.createMap();
                entry.putString("message_id", (String) map.get("message_id"));
                entry.putString("labels", (String) map.get("labels"));
                array.pushMap(entry);
            }
            promise.resolve(array);
        }, promise);
    }

    @ReactMethod
    public void getLatestMessages(int page, int pageSize, Promise
            promise) {
        RunSafe.runSafelyWith(() -> {
            List<Message> messages = MessageService.getLatestMessages(page, pageSize);

            WritableArray array = Arguments.createArray();
            for (Message msg : messages) array.pushMap(msg.toMap());
            promise.resolve(array);
        }, promise);
    }

    @ReactMethod
    public void deleteAll(Promise promise) {
        RunSafe.runSafelyWith(() -> {
            MessageService.deleteAll();
        }, promise);

    }

    @ReactMethod
    public void updateAttachmentById(ReadableMap
                                             attachmentMap, Promise promise) {
//        Attachment attachment = Attachment.fromMap(attachmentMap);
//        MessageService.updateAttachmentById(attachment);
    }

    @ReactMethod
    public void checkMessageIds(ReadableArray
                                        messageIds, Promise promise) {
        RunSafe.runSafelyWith(() -> {
            List<String> ids = new ArrayList<>();

            for (int i = 0; i < messageIds.size(); i++)
                ids.add(messageIds.getString(i));
            List<String> pending = MessageService.checkMessageIds(ids);
            WritableArray array = Arguments.createArray();
            for (String id : pending) array.pushString(id);
            promise.resolve(array);
        }, promise);
    }

    @ReactMethod
    public void resyncData(Promise promise) {
        RunSafe.runSafelyWith(() -> {
            MessageService.resyncData();
            promise.resolve(null);
        }, promise);
    }
}
