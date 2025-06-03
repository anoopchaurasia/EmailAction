package com.action.email.realm.service;

import io.realm.Realm;
import io.realm.RealmResults;
import io.realm.exceptions.RealmException;
import io.realm.RealmList;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import android.util.Log;

import com.action.email.realm.config.RealmManager;
import com.action.email.realm.model.Activity;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

public class ActivityService {
    private static final String TAG = "ActivityMethods";

    private static final Pattern EMAIL_REGEX = Pattern.compile("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
    private static final Pattern DOMAIN_REGEX = Pattern.compile("^(?!-)[A-Za-z0-9-]+([\\-\\.]{1}[a-z0-9]+)*\\.[A-Za-z]{2,6}$");

    public static Activity createObject(Activity data) {
        validate(data, false);
        if (data.getId() == null || data.getId().isEmpty()) {
            data.setId(UUID.randomUUID().toString());
        }
        data.setCreated_at(new Date());

        Realm realm = RealmManager.getRealm();
        try {
            realm.executeTransaction(r -> {
                r.copyToRealmOrUpdate(Collections.singleton(data));
            });
        } catch (RealmException e) {
            Log.e(TAG, "Error creating Activity object", e);
            FirebaseCrashlytics.getInstance().recordException(e);
        } 
        return data;
    }

    public static void deleteAll() {
        Realm realm = RealmManager.getRealm();
        try {
            realm.executeTransaction(r -> {
                RealmResults<Activity> results = r.where(Activity.class).findAll();
                results.deleteAllFromRealm();
            });
        } catch (RealmException e) {
            FirebaseCrashlytics.getInstance().recordException(e);
            Log.e(TAG, "Error deleting all Activity objects", e);
        } 
    }

    public static List<Activity> getNoCompleted() {
        Realm realm = RealmManager.getRealm();
        // Caller should close realm after usage
        List<Activity> activities = realm.copyFromRealm(realm.where(Activity.class).equalTo("completed", false).findAll());
        return activities;
    }

    public static void deleteObjectById(String id) {
        Realm realm = RealmManager.getRealm();
        try {
            realm.executeTransaction(r -> {
                Activity obj = r.where(Activity.class).equalTo("id", id).findFirst();
                if (obj != null) {
                    obj.deleteFromRealm();
                }
            });
        } catch (RealmException e) {
            FirebaseCrashlytics.getInstance().recordException(e);
            Log.e(TAG, "Error deleting Activity by id", e);
        } 
    }

    public static void updateObjectById(String id, Activity data) {
        validate(data, true);
        Realm realm = RealmManager.getRealm();
        try {
            realm.executeTransaction(r -> {
                Activity obj = r.where(Activity.class).equalTo("id", id).findFirst();
                if (obj != null) {
                    // Update fields individually (Realm objects are live)
                    if (data.getFrom() != null) obj.setFrom(data.getFrom());
                    if (data.getTo() != null) obj.setTo(data.getTo());
                    if (data.getSubject() != null) obj.setSubject(data.getSubject());
                    if (data.getCreated_at() != null) obj.setCreated_at(data.getCreated_at());
                    if (data.getBody() != null) obj.setBody(data.getBody());
                    obj.setDelay(data.getDelay());
                    if (data.getAction() != null) obj.setAction(data.getAction());
                    if (data.getType() != null) obj.setType(data.getType());
                    if (data.getFrom_label() != null) obj.setFrom_label(data.getFrom_label());
                    if (data.getTo_label() != null) obj.setTo_label(data.getTo_label());
                    if (data.getTitle() != null) obj.setTitle(data.getTitle());
                    if (data.getDelete_at() != null) obj.setDelete_at(data.getDelete_at());
                    obj.setCompleted(data.isCompleted());
                    if (data.getRan_at() != null) obj.setRan_at(data.getRan_at());
                }
            });
        } catch (RealmException e) {
            FirebaseCrashlytics.getInstance().recordException(e);
            Log.e(TAG, "Error updating Activity", e);
        } 
    }

    public static void validate(Activity activity, boolean isUpdate) {
        if (activity == null) return;

        if (activity.getFrom() != null) {
            for (String f : activity.getFrom()) {
                validateFrom(f);
            }
        }
        if (activity.getTitle() != null) {
            validateTitle(activity.getTitle());
        }
        if (activity.getTo_label() != null) {
            validateToLabel(activity.getTo_label());
        }
    }

    public static List<Activity> getAll() {
        Realm realm = RealmManager.getRealm();
        // Caller should close realm after usage
        List<Activity> activities = realm.copyFromRealm(realm.where(Activity.class).findAll());
        return activities;
    }

    public static List<Activity> getBySender(String sender) {
        Realm realm = RealmManager.getRealm();
        // Caller should close realm after usage
        List<Activity> activities = realm.copyFromRealm(realm.where(Activity.class).contains("from", sender).findAll());
        return activities;
    }

    public static void validateFrom(String from) {
        if (from == null) return;
        boolean isEmail = EMAIL_REGEX.matcher(from).matches();
        boolean isDomain = DOMAIN_REGEX.matcher(from).matches();
        if (!isEmail && !isDomain) {
            throw new IllegalArgumentException(from + " is not a valid email id or domain");
        }
    }

    public static void validateTitle(String title) {
        if (title == null || title.length() < 3) {
            throw new IllegalArgumentException("The length of the title '" + title + "' is less than 3");
        }
    }

    public static void validateToLabel(String labelId) {
        if (labelId == null || labelId.isEmpty()) {
            throw new IllegalArgumentException("Label/Folder required to setup rule");
        }
    }
}
