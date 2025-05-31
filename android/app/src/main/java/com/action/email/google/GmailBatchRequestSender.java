package com.action.email.google;

import android.os.Build;
import android.util.Log;

import com.action.email.realm.model.Message;

import java.io.IOException;
import java.util.*;
import java.util.function.Function;
import okhttp3.*;

public class GmailBatchRequestSender {

    private static final String TAG = "GmailBatchRequestSender";
    private static final String GMAIL_BATCH_URL = "https://www.googleapis.com/batch/gmail/v1";
    private static final MediaType MEDIA_TYPE = MediaType.parse("multipart/mixed");

    private static final OkHttpClient client = new OkHttpClient();


    public static List<Message> sendBatchRequest(
            List<String> ids,
            Function<String, String> methodPathBuilder,       // e.g., id -> "POST /gmail/v1/users/me/messages/{id}/modify"
            Function<String, Map<String, String>> headersBuilder, // e.g., id -> headers
            Function<String, String> bodyBuilder,             // e.g., id -> JSON body string or null
            String accessToken
    ) {
        Set<String> failedIds = new HashSet<>();
        String boundary = "batch_" + System.currentTimeMillis();
        String CRLF = "\r\n";

        StringBuilder batchBody = new StringBuilder();

        for (String id : ids) {
            String methodAndPath = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                methodAndPath = methodPathBuilder.apply(id);
            }
            Map<String, String> headers = headersBuilder != null ? headersBuilder.apply(id) : new HashMap<>();
            String body = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                body = bodyBuilder != null ? bodyBuilder.apply(id) : null;
            }

            batchBody.append("--").append(boundary).append(CRLF)
                    .append("Content-Type: application/http").append(CRLF)
                    .append("Content-ID: <").append(id).append(">").append(CRLF)
                    .append(CRLF)
                    .append(methodAndPath).append(CRLF);

            for (Map.Entry<String, String> entry : headers.entrySet()) {
                batchBody.append(entry.getKey()).append(": ").append(entry.getValue()).append(CRLF);
            }

            batchBody.append(CRLF); // Empty line before body

            if (body != null && !body.isEmpty()) {
                batchBody.append(body).append(CRLF);
            }
        }

        batchBody.append("--").append(boundary).append("--").append(CRLF);

        Request request = new Request.Builder()
                .url(GMAIL_BATCH_URL)
                .addHeader("Authorization", "Bearer " + accessToken)
                .addHeader("Content-Type", "multipart/mixed; boundary=" + boundary)
                .post(RequestBody.create(batchBody.toString(), MediaType.parse("multipart/mixed; boundary=" + boundary)))
                .build();

        try (Response response = client.newCall(request).execute()) {

            if (!response.isSuccessful()) {
                Log.e(TAG, "Batch request failed: " + response.code() + " -> " + response.message());
                failedIds.addAll(ids);
            }
            return null;

        } catch (IOException e) {
            Log.e(TAG, "IOException during batch request", e);
        }

        return null;
    }

    @FunctionalInterface
    public interface TriConsumer<A, B, C> {
        void accept(A a, B b, C c) throws IOException;
    }
}
