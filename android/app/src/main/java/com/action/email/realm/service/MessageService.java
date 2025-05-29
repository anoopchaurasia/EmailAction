package com.action.email.realm.service;


import android.os.Build;

import io.realm.Realm;
import io.realm.RealmResults;
import io.realm.Sort;

import com.action.email.realm.model.Attachment;
import com.action.email.realm.model.Message;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MessageService {
    private Realm realm;

    public MessageService() {
        
    }

    public void create(Message message) {
        realm.executeTransaction(r -> r.insert(message));
    }

    public List<Message> readMessage() {
        return realm.where(Message.class)
                .sort("date", Sort.DESCENDING)
                .limit(10)
                .findAll();
    }

    public RealmResults<Message> readAll() {
        return realm.where(Message.class)
                .notEqualTo("labels", "TRASH")
                .findAll();
    }

    public Message readById(String id) {
        return realm.where(Message.class).equalTo("message_id", id).findFirst();
    }

    public void update(Message message) {
        realm.executeTransaction(r -> r.insertOrUpdate(message));
    }

    public void delete(Message message) {
        realm.executeTransaction(r -> message.deleteFromRealm());
    }

    public boolean checkMessageId(String id) {
        return readById(id) != null;
    }

    public List<Map<String, Object>> getCountBySenderDomain() {
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

    public RealmResults<Message> getCountBySender(String sender) {
        return realm.where(Message.class)
            .equalTo("labels", "INBOX")
            .equalTo("sender", sender)
            .findAll();
    }

    public List<Message> getBySender(String sender, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        return realm.where(Message.class)
            .equalTo("sender", sender)
            .equalTo("labels", "INBOX")
            .sort("date", Sort.DESCENDING)
            .findAll()
            .subList(offset, offset + pageSize);
    }

    public List<Message> getByDomain(String domain, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        return realm.where(Message.class)
            .equalTo("sender_domain", domain)
            .equalTo("labels", "INBOX")
            .sort("date", Sort.DESCENDING)
            .findAll()
            .subList(offset, offset + pageSize);
    }

    public Message getById(String messageId) {
        return realm.where(Message.class)
            .equalTo("message_id", messageId)
            .findFirst();
    }

    public List<Map<String, Object>> fetchMessageIdBySenders(List<String> senders) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (String sender : senders) {
            RealmResults<Message> messages = realm.where(Message.class)
                .equalTo("sender", sender)
                .findAll();

            for (Message m : messages) {
                Map<String, Object> obj = new HashMap<>();
                obj.put("message_id", m.getMessage_id());
                obj.put("labels", m.getLabels());
                result.add(obj);
            }
        }
        return result;
    }

    public List<Message> getLatestMessages(int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        return realm.where(Message.class)
            .equalTo("labels", "INBOX")
            .sort("date", Sort.DESCENDING)
            .findAll()
            .subList(offset, offset + pageSize);
    }

    public void deleteAll() {
        realm.executeTransaction(r -> {
            r.delete(Message.class);
            r.delete(Attachment.class);
        });
    }

    public void updateAttachmentById(Attachment attachment) {
        realm.executeTransaction(r -> r.insertOrUpdate(attachment));
    }

    public void close() {
        if (!realm.isClosed()) realm.close();
    }

    public List<String> checkMessageIds(List<String> messageIds) {
        this.start();
        List<String> pending = new ArrayList<>();
        for (int i=0; i<messageIds.size(); i++) {
            if(getById(messageIds.get(i)) == null) {
                pending.add(messageIds.get(i));
            }
        }
        this.stop();
        return pending;
    }

    public MessageService start() {
        this.realm = Realm.getDefaultInstance();
        return this;
    }
    public void stop() {
         this.realm.close();
         this.realm = null;
    }
}
