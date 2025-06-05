package com.action.email.realm.service;


import android.os.Build;
import android.util.Log;

import io.realm.Case;
import io.realm.Realm;
import io.realm.RealmResults;
import io.realm.Sort;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import com.action.email.realm.config.RealmManager;
import com.action.email.realm.model.MessageAggregate;
import com.facebook.react.bridge.WritableMap;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

public class MessageAggregateService {

    private static final String TAG = "MessageAggregateService";

    public static void create(final MessageAggregate data) {
       Realm realm = RealmManager.getRealm();
        try {
            realm.executeTransaction(r -> {
                r.insert(Collections.singleton(data));
            });
            //MessageEvent.emit("message_aggregation_changed", "create");
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
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

    public static List<MessageAggregate> getPage(String sender, int page, int pageSize) {


        Realm realm = RealmManager.getRealm();
        int offset = (page - 1) * pageSize;

        List<MessageAggregate> messageAggregates;
        if(sender.trim().isEmpty()) {
            messageAggregates = realm.where(MessageAggregate.class)
                    .sort("count", Sort.DESCENDING)
                    .findAll();
        } else {
            messageAggregates = realm.where(MessageAggregate.class)
                    .contains("sender", sender, Case.INSENSITIVE)
                    .sort("count", Sort.DESCENDING)
                    .findAll();
        }
        int totalCount = messageAggregates.size();
        Log.d(TAG, "Total count: "+ totalCount);
        if(offset >= totalCount) {
            return new ArrayList<>(); // Return empty list if offset is out of bounds
        }
        messageAggregates = realm.copyFromRealm(messageAggregates .subList(offset, Math.min(offset + pageSize, messageAggregates.size()) ));
        Log.d(TAG, "sender: "+ sender + " page: "+ page + " messsage aggregate count: "+ messageAggregates.size());

        return messageAggregates;

    }

    public static int getCountByDomain() {
        Realm realm = RealmManager.getRealm();
        List<MessageAggregate> messageAggregates = realm.where(MessageAggregate.class)
                .findAll();


        // Step 2: Aggregate in memory
        Map<String, MessageAggregate> first_entry = new HashMap<>();
        for (MessageAggregate item : messageAggregates) {
            String domain = item.getSender_domain();
            if(!first_entry.containsKey(domain)) {
                first_entry.put(domain, item);
            }
        }
        return first_entry.size();
    }

    public interface AggregateTransaction {
        void execute(Realm realm, MessageAggregate agg);
    }

    public static void withTransaction(AggregateTransaction logic, String sender) {
        Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {
            MessageAggregate agg = r.where(MessageAggregate.class)
                    .equalTo("sender", sender)
                    .findFirst();
            logic.execute(r, agg);
        });
    }
    private static List<Map<WritableMap, Integer>> sortedDomainList;
    public static List<Map<WritableMap, Integer>> getPageForDomain(String sender_domain, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        // Step 1: Fetch all objects (or use a query if needed)
        if(page==1 || sortedDomainList==null) {

            Realm realm = RealmManager.getRealm();
            List<MessageAggregate> messageAggregates;
            if(sender_domain.trim().isEmpty()) {
                messageAggregates = realm.where(MessageAggregate.class)
                        .sort("count", Sort.DESCENDING)
                        .findAll();
            } else {
                messageAggregates = realm.where(MessageAggregate.class)
                        .contains("sender_domain", sender_domain, Case.INSENSITIVE)
                        .sort("count", Sort.DESCENDING)
                        .findAll();
            }

            // Step 2: Aggregate in memory
            Map<String, Integer> domainToCountMap = new HashMap<>();
            Map<String, MessageAggregate> first_entry = new HashMap<>();
            for (MessageAggregate item : messageAggregates) {
                String domain = item.getSender_domain();
                int currentCount = item.getCount();
                if(!first_entry.containsKey(domain)) {
                    first_entry.put(domain, item);
                }
                if (domain != null) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                        domainToCountMap.put(domain, domainToCountMap.getOrDefault(domain, 0) + currentCount);
                    }
                }
            }
            sortedDomainList = new ArrayList<Map<WritableMap, Integer>>();
            // Step 3: Sort the map entries by count in descending order
            ArrayList<Map.Entry<String, Integer>> result = new ArrayList<>(domainToCountMap.entrySet());
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                result.sort((a, b) -> Integer.compare(b.getValue(), a.getValue())); // descending
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                result.forEach(x->{
                    Map<WritableMap, Integer> map = new HashMap<>();
                    map.put(first_entry.get(x.getKey()).toMap(), x.getValue());
                    sortedDomainList.add(map);
                });
            }
        }
        // Step 4: Take top 20 entries
        List<Map<WritableMap, Integer>> top20Domains = sortedDomainList.subList(offset, Math.min(offset+pageSize, sortedDomainList.size()));
        return top20Domains;
    }
}
