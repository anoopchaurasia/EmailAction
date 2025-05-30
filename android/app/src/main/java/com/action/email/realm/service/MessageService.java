package com.action.email.realm.service;


import android.os.Build;

import io.realm.Realm;
import io.realm.RealmResults;
import io.realm.Sort;

import com.action.email.realm.model.Attachment;
import com.action.email.realm.model.Message;
import com.action.email.realm.model.MessageAggregate;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class MessageService {
    private Realm realm;

    public MessageService() {
        
    }

     public static void create(Message message) {
        Realm realm = Realm.getDefaultInstance();
        realm.executeTransaction(r -> r.insert(message));
        realm.close();
    }

     public static List<Message> readMessage() {
        Realm realm = Realm.getDefaultInstance();
        List<Message> messages = realm.copyFromRealm(realm.where(Message.class)
                .sort("date", Sort.DESCENDING)
                .limit(10)
                .findAll());
        realm.close();
        return messages;
    }

     public static List<Message> readAll() {
        Realm realm = Realm.getDefaultInstance();
        List<Message> messages = realm.copyFromRealm(realm.where(Message.class)
                .notEqualTo("labels", "TRASH")
                .findAll());
        realm.close();
        return messages;
    }

     public static Message readById(String id) {
        Realm realm = Realm.getDefaultInstance();
        Message message = realm.copyFromRealm(Objects.requireNonNull(realm.where(Message.class).equalTo("message_id", id).findFirst()));
        realm.close();
        return message;
    }

     public static void update(Message message) {
        Realm realm = Realm.getDefaultInstance();
        realm.executeTransaction(r -> r.insertOrUpdate(message));
        realm.close();
    }

     public static void delete(Message message) {
        Realm realm = Realm.getDefaultInstance();
        realm.executeTransaction(r -> message.deleteFromRealm());
        realm.close();
    }

     public static boolean checkMessageId(String id) {
        return readById(id) != null;
    }

     public static List<Map<String, Object>> getCountBySenderDomain() {
        Realm realm = Realm.getDefaultInstance();
        RealmResults<Message> messages = realm.where(Message.class)
            .equalTo("labels", "INBOX")
            .findAll();

        Map<String, Integer> countMap = new HashMap<>();
        for (Message msg : messages) {
            String domain = msg.getSender_domain();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                countMap.put(domain, countMap.getOrDefault(domain, 0) + 1);
            }
        }

        List<Map<String, Object>> results = new ArrayList<>();
        for (String key : countMap.keySet()) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("k", key);
            entry.put("v", countMap.get(key));
            results.add(entry);
        }
        realm.close();
        return results;
    }

     public static List<Message> getCountBySender(String sender) {

        Realm realm = Realm.getDefaultInstance();
        List<Message> messages =  realm.copyFromRealm(realm.where(Message.class)
            .equalTo("labels", "INBOX")
            .equalTo("sender", sender)
            .findAll());
        realm.close();
        return messages;
    }

     public static List<Message> getBySender(String sender, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        Realm realm = Realm.getDefaultInstance();
        List<Message> messages =  realm.where(Message.class)
            .equalTo("sender", sender)
            .equalTo("labels", "INBOX")
            .sort("date", Sort.DESCENDING)
            .findAll();
        messages = realm.copyFromRealm(messages.subList(offset, Math.min(offset + pageSize, messages.size()) ));
        realm.close();
        return messages;
    }

     public static List<Message> getByDomain(String domain, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        Realm realm = Realm.getDefaultInstance();
        List<Message> messages = realm.where(Message.class)
                .equalTo("sender_domain", domain)
                .equalTo("labels", "INBOX")
                .sort("date", Sort.DESCENDING)
                .findAll();
        messages = realm.copyFromRealm(messages
            .subList(offset, Math.min(messages.size(), offset+pageSize)));
        realm.close();
        return messages;
    }

     public static Message getById(String messageId) {
        Realm realm = Realm.getDefaultInstance();
        Message message = realm.where(Message.class)
                .equalTo("message_id", messageId)
                .findFirst();
        realm.close();
        return message;
    }

     public static List<Map<String, Object>> fetchMessageIdBySenders(List<String> senders) {
        Realm realm = Realm.getDefaultInstance();
        List<Map<String, Object>> result = new ArrayList<>();
        for (String sender : senders) {
            List<Message> messages = realm.copyFromRealm(realm.where(Message.class)
                .equalTo("sender", sender)
                .findAll());

            for (Message m : messages) {
                Map<String, Object> obj = new HashMap<>();
                obj.put("message_id", m.getMessage_id());
                obj.put("labels", m.getLabels());
                result.add(obj);
            }
        }
        realm.close();
        return result;
    }

     public static List<Message> getLatestMessages(int page, int pageSize) {
        Realm realm = Realm.getDefaultInstance();
        int offset = (page - 1) * pageSize;
        List<Message> messages =  realm.where(Message.class)
            .equalTo("labels", "INBOX")
            .sort("date", Sort.DESCENDING)
            .findAll()
            ;
         messages = realm.copyFromRealm(messages .subList(offset, Math.min(offset + pageSize, messages.size()) ));
        realm.close();
        return messages;
    }

     public static void deleteAll() {
        Realm realm = Realm.getDefaultInstance();
        realm.executeTransaction(r -> {
            r.delete(Message.class);
            r.delete(Attachment.class);
        });
        realm.close();
    }

     public static void updateAttachmentById(Attachment attachment) {
        Realm realm = Realm.getDefaultInstance();
        realm.executeTransaction(r -> r.insertOrUpdate(attachment));
        realm.close();
    }

     public static void close() {
        Realm realm = Realm.getDefaultInstance();
        if (!realm.isClosed()) realm.close();
        realm.close();
    }

     public static List<String> checkMessageIds(List<String> messageIds) {
        Realm realm = Realm.getDefaultInstance();
        List<String> pending = new ArrayList<>();
        for (int i=0; i<messageIds.size(); i++) {
            if(getById(messageIds.get(i)) == null) {
                pending.add(messageIds.get(i));
            }
        }
        realm.close();
        return pending;
    }
}
