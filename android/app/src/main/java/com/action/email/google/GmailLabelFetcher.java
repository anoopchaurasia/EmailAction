package com.action.email.google;

import android.content.Context;
import android.util.Log;

import com.action.email.realm.model.Label;
import com.action.email.realm.service.LabelService;

import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GmailLabelFetcher {

    private static final String GMAIL_LABELS_ENDPOINT = "https://gmail.googleapis.com/gmail/v1/users/me/labels";
    private static final String TAG = "GmailLabelFetcher";

    public interface LabelCallback {
        void onSuccess(JSONArray labels);
        void onError(Exception e);
    }

    public static void fetchLabels(Context context) throws Exception {
        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(GMAIL_LABELS_ENDPOINT)
                .addHeader("Authorization", "Bearer " + AccessTokenHelper.fetchAccessToken(context).accessToken)
                .addHeader("Accept", "application/json")
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                try (ResponseBody responseBody = response.body()) {
                    if (!response.isSuccessful()) {
                        Log.e(TAG, "failed to fetch labels: "+ response.code());
                        return;
                    }

                    String responseData = responseBody.string();
                    JSONObject json = new JSONObject(responseData);
                    JSONArray labelsJson = json.getJSONArray("labels");

                    for (int i = 0; i < labelsJson.length(); i++) {
                       Label label = Label.fromGmailJson(labelsJson.getJSONObject(i));
                       LabelService.update(label);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
}
