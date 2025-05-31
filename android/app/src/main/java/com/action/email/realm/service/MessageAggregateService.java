package com.action.email.realm.service;


import android.util.Log;
import io.realm.Realm;
import io.realm.RealmResults;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import com.action.email.realm.config.RealmManager;
import com.action.email.realm.model.MessageAggregate;

public class MessageAggregateService {

    public static void create(final MessageAggregate data) {
       Realm realm = RealmManager.getRealm();
        try {
            realm.executeTransaction(r -> {
                r.insert(Collections.singleton(data));
            });
            //MessageEvent.emit("message_aggregation_changed", "create");
        } catch (Exception e) {
            Log.e("RealmError", "create failed: " + e.getMessage());
        } finally {
            
        }
    }

    public static void deleteAll() {
       Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {
            r.delete(MessageAggregate.class);
        });
        //MessageEvent.emit("message_aggregation_changed", "delete");
    }

    public static void deleteBySender(String senderId) {
       Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {
            MessageAggregate sender = r.where(MessageAggregate.class).equalTo("sender", senderId).findFirst();
            if (sender != null) {
                sender.deleteFromRealm();
            //    MessageEvent.emit("message_aggregation_changed", "delete");
            }
        });
        
    }

    public static void deleteBySenders(List<String> senders) {
        for (String sender : senders) {
            deleteBySender(sender);
        }
    }

    public static void deleteBySubDomain(List<String> subdomains) {
       Realm realm = RealmManager.getRealm();
        for (String subdomain : subdomains) {
            RealmResults<MessageAggregate> results = realm.where(MessageAggregate.class)
                    .equalTo("sender_domain", subdomain)
                    .findAll();
            realm.executeTransaction(r -> results.deleteAllFromRealm());
        }
        
        //MessageEvent.emit("message_aggregation_changed", "delete");
    }

    public static List<MessageAggregate> readMessage() {
       Realm realm = RealmManager.getRealm();
        RealmResults<MessageAggregate> results = realm.where(MessageAggregate.class)
               // .equalTo("labels.id", "INBOX")
                .sort("count", io.realm.Sort.DESCENDING)
                .findAll();
        List<MessageAggregate> data = realm.copyFromRealm(results);
        
        return data;
    }

    public static List<MessageAggregate> readAll() {
       Realm realm = RealmManager.getRealm();
        RealmResults<MessageAggregate> results = realm.where(MessageAggregate.class).findAll();
        List<MessageAggregate> data = realm.copyFromRealm(results);
        
        return data;
    }

    public static int count() {
       Realm realm = RealmManager.getRealm();
        int size = (int) realm.where(MessageAggregate.class).count();
        
        return size;
    }

    public static MessageAggregate readBySender(String sender) {
       Realm realm = RealmManager.getRealm();
        MessageAggregate aggregate = realm.where(MessageAggregate.class)
                .equalTo("sender", sender).findFirst();
        MessageAggregate copy = realm.copyFromRealm(aggregate);
        
        return copy;
    }

    public static void update(final MessageAggregate data) {
       Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {
            r.insertOrUpdate(data);
        });
        
      //  MessageEvent.emit("message_aggregation_changed", "update");
    }

    public static MessageAggregate updateCount(final MessageAggregate newData) {
       Realm realm = RealmManager.getRealm();
        AtomicReference<MessageAggregate> result = new AtomicReference<>();

        realm.executeTransaction(r -> {
            MessageAggregate existing = r.where(MessageAggregate.class)
                    .equalTo("sender", newData.getSender())
                    .findFirst();

            if (existing == null) {
                r.insert(newData);
                result.set(newData);
            } else {
                existing.setCount(existing.getCount() + newData.getCount());
                existing.setLabelCount(newData);
                result.set(existing);
            }
        });

        
       // MessageEvent.emit("message_aggregation_changed", "update");
        return result.get();
    }
}
