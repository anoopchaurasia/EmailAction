package com.action.email.google;

import android.content.Context;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import com.action.email.data.MessageAggregateData;
import com.action.email.data.ProcessRule;
import com.action.email.realm.model.Message;
import com.action.email.realm.model.MessageAggregate;
import com.action.email.realm.reactmodule.NativeNotifierModule;
import com.action.email.realm.service.GmailSyncStateService;
import com.action.email.realm.service.MessageService;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

public class GmailHistoryFetcher {

    private static final String TAG = "GmailHistoryService";
    private static final String HISTORY_URL = "https://gmail.googleapis.com/gmail/v1/users/me/history";

    private final OkHttpClient httpClient;
    private  final Context appContext;
    private final GmailMessageFetcher gmailMessageFetcher;
    public GmailHistoryFetcher(Context context) {
        this.httpClient = new OkHttpClient.Builder()
                .callTimeout(60, TimeUnit.SECONDS)
                .build();
        appContext = context;
        gmailMessageFetcher = new GmailMessageFetcher(appContext);
    }

    public interface HistoryCallback {
        void onSuccess(String newHistoryId);
        void onFailure(Exception e);
    }

    public synchronized void fetchHistoryAndSync() throws Exception {
        String startHistoryId = GmailSyncStateService.getGmailHistoryId();
        Log.d(TAG, "startHistoryId: "+ startHistoryId);
        if(startHistoryId==null) {
            startHistoryId = fetchLatestHistoryIdBlocking(AccessTokenHelper.fetchAccessToken(appContext).accessToken);
            Log.d(TAG, "got latest history id "+ startHistoryId);
            GmailSyncStateService.setGmailHistoryId(startHistoryId);
        }
        HttpUrl url = HttpUrl.parse(HISTORY_URL).newBuilder()
                .addQueryParameter("startHistoryId", startHistoryId)
                .addQueryParameter("historyTypes", "messageAdded")
                .addQueryParameter("historyTypes", "messageDeleted")
                .addQueryParameter("historyTypes", "labelAdded")
                .addQueryParameter("historyTypes", "labelRemoved").build();

        Log.d(TAG, "URL: "+ url);
        Request request = new Request.Builder()
                .url(url)
                .header("Authorization", "Bearer " + AccessTokenHelper.fetchAccessToken(appContext).accessToken)
                .build();
        Log.d(TAG, "Request: "+ request);
        httpClient.newCall(request).enqueue(new Callback() {
            @Override public void onFailure(Call call, IOException e) {
                Log.e(TAG, "History fetch failure", e);
            }

            @Override public void onResponse(Call call, Response response) throws IOException {
                if (!response.isSuccessful()) {
                    if(response.code()==401) {
                        try {
                            AccessTokenHelper.getFreshToken(appContext);
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    }
                    Log.e(TAG, "failed to fetch history "+ response.message() + " Status: "+ response.code());
                    return;
                }

                try {
                    String body = response.body().string();
                    JSONObject json = new JSONObject(body);
                    if (!json.has("history")) {
                        Log.i(TAG, "No new history available");
                        return;
                    }

                    JSONArray historyArray = json.getJSONArray("history");
                    for (int i = 0; i < historyArray.length(); i++) {
                        JSONObject history = historyArray.getJSONObject(i);
                        Log.d(TAG, "History: "+ history);
                        // Handle messageAdded
                        if (history.has("messagesAdded")) {
                            JSONArray messagesAdded = history.getJSONArray("messagesAdded");
                            List<String> messageIds = new ArrayList<>();
                            for (int j = 0; j < messagesAdded.length(); j++) {
                                JSONObject messageObj = messagesAdded.getJSONObject(j).getJSONObject("message");
                                String messageId = messageObj.getString("id");
                                messageIds.add(messageId);

                            }
                            handleMessageAdded(messageIds );
                        }

                        // Handle messageDeleted
                        if (history.has("messagesDeleted")) {
                            JSONArray messagesDeleted = history.getJSONArray("messagesDeleted");
                            for (int j = 0; j < messagesDeleted.length(); j++) {
                                JSONObject messageObj = messagesDeleted.getJSONObject(j).getJSONObject("message");
                                String messageId = messageObj.getString("id");
                                handleMessageDeleted(messageId);
                            }
                        }


                        // Handle labelAdded
                        if (history.has("labelsAdded")) {
                            JSONArray labelsAdded = history.getJSONArray("labelsAdded");
                            for (int j = 0; j < labelsAdded.length(); j++) {
                                JSONObject labelObj = labelsAdded.getJSONObject(j);

                                JSONObject messageObj = labelObj.getJSONObject("message");
                                String messageId = messageObj.getString("id");

                                JSONArray labelIdsArray = labelObj.getJSONArray("labelIds");
                                for (int k = 0; k < labelIdsArray.length(); k++) {
                                    String labelId = labelIdsArray.getString(k);
                                    handleLabelAdded(messageId, labelId);
                                }
                            }
                        }

                        // Handle labelRemoved
                        if (history.has("labelsRemoved")) {
                            JSONArray labelsRemoved = history.getJSONArray("labelsRemoved");
                            for (int j = 0; j < labelsRemoved.length(); j++) {
                                JSONObject labelObj = labelsRemoved.getJSONObject(j);

                                JSONObject messageObj = labelObj.getJSONObject("message");
                                String messageId = messageObj.getString("id");

                                JSONArray labelIdsArray = labelObj.getJSONArray("labelIds");
                                for (int k = 0; k < labelIdsArray.length(); k++) {
                                    String labelId = labelIdsArray.getString(k);
                                    handleLabelRemoved(messageId, labelId);
                                }
                            }
                        }
                    }

                    // Save latest historyId
                    String latestHistoryId = json.getString("historyId");
                    GmailSyncStateService.setGmailHistoryId(latestHistoryId);

                } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
                    e.printStackTrace();
                }
            }
        });
    }
    private void handleMessageAdded(List<String> messageIds) {
        Log.d(TAG, "Message Added: " + messageIds);
        try {
            ///aggregater is being called from the inside only
           List<Message> messages = gmailMessageFetcher.retryBatch(messageIds);

           if(messages != null) {
               ProcessRule.takeActionOnNewMessages(messages, appContext);
               NativeNotifierModule.sendEvent(NativeNotifierModule.NEW_MESSAGE_ARRIVED, ""+messages.size());
           }
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            throw new RuntimeException(e);
        }
    }

    private void handleMessageDeleted(String messageId) {
        Log.d(TAG, "Message Deleted: " + messageId);
        Message message = MessageService.getById(messageId);
        if(message != null) {
            MessageAggregateData.onMessageDeleted(message);
            MessageService.delete(message);
        }


       // deleteMessageFromRealm(messageId);
    }

    private void handleLabelAdded(String messageId, String labelId) {
        Log.d(TAG, "Label Added: messageId=" + messageId + " labelId=" + labelId);
        Message message = MessageService.getById(messageId);
        if(message != null) {
            MessageAggregateData.onLabelAdded(message, labelId);
            MessageService.addlabel(message, labelId);
        }

    }

    private void handleLabelRemoved(String messageId, String labelId) {
        Log.d(TAG, "Label Removed: messageId=" + messageId + " labelId=" + labelId);
        // Your logic: remove labelId from message labels in Realm
        Message message = MessageService.getById(messageId);
        if(message != null) {
            MessageAggregateData.onLabelRemoved(message, labelId);
            MessageService.removeLabel(message, labelId);
        }

    }


    public String fetchLatestHistoryIdBlocking(String accessToken) throws Exception {
        OkHttpClient client = new OkHttpClient();
        String url = "https://gmail.googleapis.com/gmail/v1/users/me/profile";

        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + accessToken)
                .build();

        // Blocking call
        Response response = client.newCall(request).execute();

        if (!response.isSuccessful()) {
            throw new IOException("Unexpected response code: " + response.code());
        }

        String body = response.body().string();
        JSONObject json = new JSONObject(body);
        return json.getString("historyId");
    }



}
