package com.action.email.google;

import static java.lang.Thread.sleep;

import android.content.Context;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import okhttp3.*;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.*;

import com.action.email.data.MessageAggregateData;
import com.action.email.data.MessageList;
import com.action.email.data.TokenInfo;
import com.action.email.realm.config.RealmManager;
import com.action.email.realm.model.Attachment;
import com.action.email.realm.model.Message;
import com.action.email.realm.service.GmailSyncStateService;
import com.action.email.realm.service.MessageAggregateService;
import com.action.email.realm.service.MessageService;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import io.realm.RealmList;

public class GmailEmailFetcher {

    private static final String TAG = "GmailEmailFetcher";
    private static final String GMAIL_LIST_URL = "https://www.googleapis.com/gmail/v1/users/me/messages";
    private static final MediaType MEDIA_TYPE_TEXT = MediaType.parse("text/plain");

    private final OkHttpClient client;
    private static final int MAX_RETRIES = 4;
    private static final int MAX_EMAIL_RESULT_COUNT = 30;
    private final Context appContext;

    private final GmailMessageFetcher gmailMessageFetcher;

    public GmailEmailFetcher(Context context) throws Exception {
        appContext = context;
        gmailMessageFetcher = new GmailMessageFetcher(context);
        // Initialize the app context
        this.client = new OkHttpClient.Builder()
                .callTimeout(60, TimeUnit.SECONDS)
                .build();
    }

    public synchronized void fetchInboxEmails() {

        new Thread(() -> {

            try {
                Log.d(TAG, "Sync State "+ GmailSyncStateService.getSyncState());
                Log.d(TAG, "pageToken "+ GmailSyncStateService.getPageToken());
                if(GmailSyncStateService.getSyncState() ==GmailSyncStateService.SyncStatus.COMPLETED) {
                    return;
                }
                GmailSyncStateService.setSyncState(GmailSyncStateService.SyncStatus.INPROGRESS);
                int attempt = 0;
                String query = "-in:trash -in:spam";
                String pageToken = GmailSyncStateService.getPageToken();
                do {
                    MessageList messageList = getMessageIDs(pageToken, query);
                    List<String> messageIds = messageList.getMessageIds();
                    pageToken = messageList.getPageToken();
                   if(messageIds == null) {
                       if(attempt>= MAX_RETRIES) return;
                       attempt += 1;
                       continue;
                   }
                    gmailMessageFetcher.retryBatch(messageIds);
                    GmailSyncStateService.setPageToken(pageToken);
                } while (pageToken != null);
                GmailSyncStateService.setSyncState(GmailSyncStateService.SyncStatus.COMPLETED);

            } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
                Log.e(TAG, "Inbox fetch failed", e);
            }
             finally {
                // Notify the UI or any listeners that the fetch is complete
                Log.d(TAG, "Inbox fetch completed");
                RealmManager.closeRealm();
            }

        }).start();
    }

    public MessageList getMessageIDs(String pageToken, String query) throws Exception {
        HttpUrl.Builder urlBuilder = HttpUrl.parse(GMAIL_LIST_URL).newBuilder();
        urlBuilder.addQueryParameter("q", query);
        urlBuilder.addQueryParameter("maxResults", String.valueOf(MAX_EMAIL_RESULT_COUNT));
        if (pageToken != null) {
            urlBuilder.addQueryParameter("pageToken", pageToken);
        }

        Request listRequest = new Request.Builder()
                .url(urlBuilder.build())
                .addHeader("Authorization", "Bearer " + AccessTokenHelper.fetchAccessToken(appContext).accessToken)
                .build();

        Response response = client.newCall(listRequest).execute();
        if (!response.isSuccessful()) {
            Log.e(TAG, "Failed to list messages: " + response.code() + " retry # ");
            return null;
        }
        String responseBody = response.body().string();
        JSONObject json = new JSONObject(responseBody);
        JSONArray messages = json.optJSONArray("messages");
        pageToken = json.optString("nextPageToken", null);

        if (messages == null) return new MessageList(null, pageToken);

        List<String> messageIds = new ArrayList<>();
        for (int i = 0; i < messages.length(); i++) {
            messageIds.add(messages.getJSONObject(i).getString("id"));
        }
        return new MessageList(messageIds, pageToken);
    }

}
