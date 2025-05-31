package com.action.email.realm.service;

import androidx.annotation.Nullable;

import com.action.email.realm.config.RealmManager;
import com.action.email.realm.model.GmailSyncState;

import io.realm.Realm;

public class GmailSyncStateService {

    private static final String SYNC_STATE_ID = "gmail_sync";
    private static final String SYNC_STATUS_ID = "gmail_sync_status";
    private static final String GMAIL_HISTORY_ID = "gmail_history_id";

    public enum SyncStatus {
        INPROGRESS,
        COMPLETED,
        ERROR
    }

    public static void setPageToken(String nextPageToken) {
        Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {
            GmailSyncState state = r.where(GmailSyncState.class).equalTo("id", SYNC_STATE_ID).findFirst();
            if (state == null) state = r.createObject(GmailSyncState.class, SYNC_STATE_ID);
            state.setValue(nextPageToken);
        });
    }

    public static String getPageToken () {
        // Retrieve pageToken
         Realm realm = RealmManager.getRealm();
        GmailSyncState state = realm.where(GmailSyncState.class).equalTo("id", SYNC_STATE_ID).findFirst();
        String pageToken = (state != null) ? state.getValue() : null;
        return pageToken;
    }

    public static void setSyncState(SyncStatus status) {
        Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {
            GmailSyncState state = r.where(GmailSyncState.class).equalTo("id", SYNC_STATUS_ID).findFirst();
            if (state == null) {
                state = r.createObject(GmailSyncState.class, SYNC_STATUS_ID);
            }
            state.setValue(status.toString());
        });
    }

    public static SyncStatus getSyncState() {
        // Retrieve sync state
        Realm realm = RealmManager.getRealm();
        GmailSyncState state = realm.where(GmailSyncState.class).equalTo("id", SYNC_STATUS_ID).findFirst();
        String syncStatus = (state != null) ? state.getValue() : null;
        if(syncStatus==null) return null;
        return SyncStatus.valueOf(syncStatus);
    }

    public static void setGmailHistoryId(String historyId) {
        Realm realm = RealmManager.getRealm();
        realm.executeTransaction(r -> {
            GmailSyncState state = r.where(GmailSyncState.class).equalTo("id", GMAIL_HISTORY_ID).findFirst();
            if (state == null) {
                state = r.createObject(GmailSyncState.class, GMAIL_HISTORY_ID);
            }
            state.setValue(historyId.toString());
        });
    }
    public static String getGmailHistoryId() {
        // Retrieve sync state
        Realm realm = RealmManager.getRealm();
        GmailSyncState state = realm.where(GmailSyncState.class).equalTo("id", GMAIL_HISTORY_ID).findFirst();
        String syncStatus = (state != null) ? state.getValue() : null;
        return syncStatus;
    }



// Save pageToken



}