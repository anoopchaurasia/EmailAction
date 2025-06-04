package com.action.email.realm.service;


import android.os.Build;

import io.realm.Realm;
import io.realm.RealmResults;
import io.realm.Sort;

import com.action.email.google.GmailEmailFetcher;
import com.action.email.realm.config.RealmManager;
import com.action.email.realm.model.Attachment;
import com.action.email.realm.model.Message;
import com.action.email.realm.model.MessageAggregate;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public class MessageService {
    private Realm realm;

    public MessageService() {
        
    }

     public static void create(Message message) {
       Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> r.insert(message));
       
    }

     public static List<Message> readMessage() {
       Realm realm = RealmManager.getRealm();
        List<Message> messages = realm.copyFromRealm(realm.where(Message.class)
                .sort("date", Sort.DESCENDING)
                .limit(10)
                .findAll());
       
        return messages;
    }

     public static List<Message> readAll() {
       Realm realm = RealmManager.getRealm();
        List<Message> messages = realm.copyFromRealm(realm.where(Message.class)
                .findAll());
         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
             //messages= messages.stream().filter(x-> !x.getLabels().contains("TRASH")).collect(Collectors.toList());
         }

         return messages;
    }

    public static Integer getCount() {
        Realm realm = RealmManager.getRealm();
        Integer count = realm.where(Message.class)
                .findAll().size();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            //messages= messages.stream().filter(x-> !x.getLabels().contains("TRASH")).collect(Collectors.toList());
        }

        return count;
    }

     public static Message readById(String id) {
       Realm realm = RealmManager.getRealm();
        Message message = realm.copyFromRealm(Objects.requireNonNull(realm.where(Message.class).equalTo("message_id", id).findFirst()));
       
        return message;
    }

     public static void update(Message message) {
       Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> r.insertOrUpdate(message));
       
    }

     public static void delete(Message message) {
       Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> message.deleteFromRealm());
    }

     public static boolean checkMessageId(String id) {
        return readById(id) != null;
    }

     public static List<Map<String, Object>> getCountBySenderDomain() {
       Realm realm = RealmManager.getRealm();
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
       
        return results;
    }

     public static List<Message> getCountBySender(String sender) {

       Realm realm = RealmManager.getRealm();
        List<Message> messages =  realm.copyFromRealm(realm.where(Message.class)
            .equalTo("labels", "INBOX")
            .equalTo("sender", sender)
            .findAll());
       
        return messages;
    }

     public static List<Message> getBySender(String sender, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
       Realm realm = RealmManager.getRealm();
        List<Message> messages =  realm.where(Message.class)
            .equalTo("sender", sender)
            .equalTo("labels", "INBOX")
            .sort("date", Sort.DESCENDING)
            .findAll();
        messages = realm.copyFromRealm(messages.subList(offset, Math.min(offset + pageSize, messages.size()) ));
       
        return messages;
    }

     public static List<Message> getByDomain(String domain, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
       Realm realm = RealmManager.getRealm();
        List<Message> messages = realm.where(Message.class)
                .equalTo("sender_domain", domain)
                .equalTo("labels", "INBOX")
                .sort("date", Sort.DESCENDING)
                .findAll();
        messages = realm.copyFromRealm(messages
            .subList(offset, Math.min(messages.size(), offset+pageSize)));
       
        return messages;
    }

     public static Message getById(String messageId) {
        Realm realm = RealmManager.getRealm();
        Message message = realm.where(Message.class)
                .equalTo("message_id", messageId)
                .findFirst();
        return message;
    }

     public static List<Map<String, Object>> fetchMessageIdBySenders(List<String> senders) {
        Realm realm = RealmManager.getRealm();
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
        return result;
    }

     public static List<Message> getLatestMessages(int page, int pageSize) {
       Realm realm = RealmManager.getRealm();
        int offset = (page - 1) * pageSize;
        List<Message> messages =  realm.where(Message.class)
            .equalTo("labels", "INBOX")
            .sort("date", Sort.DESCENDING)
            .findAll()
            ;
         messages = realm.copyFromRealm(messages .subList(offset, Math.min(offset + pageSize, messages.size()) ));
       
        return messages;
    }

     public static void deleteAll() {
       Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {
            r.delete(Message.class);
            r.delete(Attachment.class);
        });
       
    }

     public static void updateAttachmentById(Attachment attachment) {
       Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> r.insertOrUpdate(attachment));
       
    }


     public static List<String> checkMessageIds(List<String> messageIds) {
       Realm realm = RealmManager.getRealm();
        List<String> pending = new ArrayList<>();
//        for (int i=0; i<messageIds.size(); i++) {
//            if(getById(messageIds.get(i)) == null) {
//                pending.add(messageIds.get(i));
//            }
//        }

         RealmResults<Message> foundMessages = realm.where(Message.class)
                 .in("message_id", messageIds.toArray(new String[0]))
                 .findAll();

// Convert found IDs to a Set
         Set<String> foundIds = new HashSet<>();
         for (Message m : foundMessages) {
             foundIds.add(m.getMessage_id());
         }

// Now collect those not in DB
         for (String id : messageIds) {
             if (!foundIds.contains(id)) {
                 pending.add(id);
             }
         }
        return pending;
    }

    public static void removeLabel(Message message, String labelId) {
        Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {

            if (message != null) {
                message.removeLabel(labelId);
            }
        });
    }
    public static void addlabel(Message message, String labelId) {
        Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {

            if (message != null) {
                message.addLabel(labelId);
            }
        });
    }

    public static void resyncData() {
        GmailSyncStateService.setSyncState(GmailSyncStateService.SyncStatus.INPROGRESS);

    }
}
