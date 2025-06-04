package com.action.email.google;

import static java.lang.Thread.sleep;

import android.content.Context;
import android.os.Build;
import android.util.Log;

import com.action.email.data.MessageAggregateData;
import com.action.email.realm.model.Attachment;
import com.action.email.realm.model.Message;
import com.action.email.realm.service.MessageService;
import com.google.firebase.crashlytics.FirebaseCrashlytics;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import io.realm.RealmList;
import io.realm.RealmSet;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class GmailMessageFetcher {
    private static final String TAG = "GmailMessageFetcher";
    private static final String GMAIL_BATCH_URL = "https://gmail.googleapis.com/batch/gmail/v1";
    private int count = 0;
    private final Context appContext;



    private final OkHttpClient client;
    private static final int MAX_RETRIES = 4;

    public GmailMessageFetcher(Context context) {
        appContext = context;
        this.client = new OkHttpClient.Builder()
                .callTimeout(60, TimeUnit.SECONDS)
                .build();
    }

    public List<Message> retryBatch(List<String> ids) throws Exception {
        count += ids.size();
        ids = MessageService.checkMessageIds(ids);
        Set<String> pending = new HashSet<>(ids);
        Log.d(TAG, "Total Count Set " + pending.size() + " total ids: "+ count);
        if(pending.size()==0) return null;
        Log.d(TAG, "Total Count in DB " + MessageService.readAll().size());
        List<Message> messages = new ArrayList<>();
        for (int attempt = 0; attempt < MAX_RETRIES && !pending.isEmpty(); attempt++) {
            Log.d(TAG, "Batch attempt #" + (attempt + 1) + " for " + pending.size() + " ids");
            MessageResponse messageResponse = fetchBatch(new ArrayList<>(pending));
            pending = messageResponse.getFailed();
            messages.addAll(messageResponse.getMessages());
            if (!pending.isEmpty()) {
                try {
                    long backoff = (long) Math.pow(2, attempt + 1) * 1000;
                    sleep(backoff);
                } catch (InterruptedException ignored) {
                }
            }

        }

        if (!pending.isEmpty()) {
            Log.w(TAG, "Failed to fetch metadata for these messageIds: " + pending);
        }
        return messages;
    }

    private MessageResponse fetchBatch(List<String> messageIds) throws Exception {

        Set<String> failedIds = new HashSet<>();
        String boundary = "batch_" + System.currentTimeMillis();
        String CRLF = "\r\n";

        StringBuilder bodyBuilder = new StringBuilder();

        for (String id : messageIds) {
            bodyBuilder
                    .append("--").append(boundary).append(CRLF)
                    .append("Content-Type: application/http").append(CRLF)
                    .append("Content-ID: <").append(id).append(">").append(CRLF)
                    .append(CRLF)
                    .append("GET https://www.googleapis.com/gmail/v1/users/me/messages/")
                    .append(id)
                    .append("?format=metadata")
                    .append("&metadataHeaders=Subject")
                    .append("&metadataHeaders=From")
                    .append("&metadataHeaders=To")
                    .append("&metadataHeaders=Date")
                    .append("&metadataHeaders=LabelIds")
                    .append(CRLF)
                    .append(CRLF);
        }

        bodyBuilder.append("--").append(boundary).append("--").append(CRLF);

        Request request = new Request.Builder()
                .url("https://www.googleapis.com/batch/gmail/v1") // ✅ confirm this
                .addHeader("Authorization", "Bearer " + AccessTokenHelper.fetchAccessToken(appContext).accessToken)
                .addHeader("Content-Type", "multipart/mixed; boundary=" + boundary)
                .post(RequestBody.create(bodyBuilder.toString(), MediaType.parse("multipart/mixed; boundary=" + boundary)))
                .build();

        List<Message> messages = new ArrayList<>();
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                Log.e(TAG, "Batch request failed: " + response.code() + " -> " + response.message());
                return new MessageResponse(messages, new HashSet<>(messageIds))  ; // all failed
            }


            messages = parseMultipartResponse(response, failedIds);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                messages.forEach(msg -> MessageService.update(msg));
                MessageAggregateData.buildAggregatesFromMessages(messages);
            }

        } catch (IOException e) {
            Log.e(TAG, "IOException in batch call", e);
            return new MessageResponse(messages, new HashSet<>(messageIds)) ;
        }
        return new MessageResponse(messages, failedIds);
    }

    private static String getBoundary(Response response) {

        String contentType = response.header("Content-Type");

        String boundary = null;
        if (contentType != null && contentType.contains("boundary=")) {
            boundary = contentType.split("boundary=")[1];
            // In case it's quoted, remove quotes
            if (boundary.startsWith("\"") && boundary.endsWith("\"")) {
                boundary = boundary.substring(1, boundary.length() - 1);
            }
        }
        return boundary;
    }

    public static List<Message> parseMultipartResponse(Response response, Set<String> failedIds) throws IOException {
        String body = response.body().string();
        String boundary = getBoundary(response);
        String[] parts = body.split("--" + Pattern.quote(boundary) + "(--)?\\r?\\n");
        Pattern statusLine = Pattern.compile("HTTP/1.1 (\\d{3}) .*");
        Pattern idPattern = Pattern.compile("Content-ID: <(.+?)>");
        Log.d(TAG, "total parts: " + parts.length);
        List<Message> messages = new ArrayList<>();
        for (String part : parts) {
            if (part.trim().isEmpty() ) continue;
            Matcher statusMatcher = statusLine.matcher(part);
            Matcher idMatcher = idPattern.matcher(part);
            String messageId = null;
            int statusCode = -1;

            if (idMatcher.find()) {
                messageId = idMatcher.group(1);
                if (messageId.startsWith("response-")) {
                    messageId = messageId.substring("response-".length());
                }
            }

            if (statusMatcher.find()) {
                statusCode = Integer.parseInt(statusMatcher.group(1));
            }
            if (messageId != null && statusCode >= 400) {
                Log.w(TAG, "Failed msg ID " + messageId + ": " + statusCode);
                failedIds.add(messageId);
            } else if (messageId != null) {
                try {
                    Message msg = parseMetadata(part);
                    if (msg != null) {
                        messages.add(msg);
                    }
                } catch (Exception e) {
                    FirebaseCrashlytics.getInstance().recordException(e);
                   e.printStackTrace();
                }

            }
        }
        return messages;
    }
    private static Message parseMetadata(String responsePart) {
        try {
            int jsonStart = responsePart.indexOf("{");
            if (jsonStart == -1) return null;

            String json = responsePart.substring(jsonStart);
            JSONObject root = new JSONObject(json);

            String messageId = root.optString("id", "");
            JSONArray headers = root.getJSONObject("payload").optJSONArray("headers");
            JSONArray labelIds = root.optJSONArray("labelIds");
            String historyId = root.optString("historyId");

            String subject = "", from = "", dateStr = "";
            for (int i = 0; i < headers.length(); i++) {
                JSONObject h = headers.getJSONObject(i);
                String name = h.getString("name");
                switch (name) {
                    case "Subject": subject = h.getString("value"); break;
                    case "From": from = h.getString("value"); break;
                    case "Date": dateStr = h.getString("value"); break;
                }
            }

            // Sender name and email
            String senderName = "", senderEmail = "", senderDomain = "";
            if (from.contains("<")) {
                int lt = from.indexOf("<");
                int gt = from.indexOf(">");
                senderName = from.substring(0, lt).trim();
                senderEmail = from.substring(lt + 1, gt).trim();
            } else {
                senderEmail = from.trim();
            }

            if (senderEmail.contains("@")) {
                senderDomain = senderEmail.split("@")[1];
            }

            // Labels
            RealmSet<String> labels = new RealmSet<>();
            if (labelIds != null) {
                for (int i = 0; i < labelIds.length(); i++) {
                    labels.add(labelIds.getString(i));
                }
            }

            // Attachments
            JSONArray parts = root.getJSONObject("payload").optJSONArray("parts");
            RealmList<Attachment> attachments = new RealmList<>();
            boolean hasAttachment = false;

            if (parts != null) {
                for (int i = 0; i < parts.length(); i++) {
                    JSONObject part = parts.getJSONObject(i);
                    String filename = part.optString("filename", "");
                    if (!filename.isEmpty()) {
                        hasAttachment = true;
                        // attachments.add(filename);
                    }
                }
            }

            Message msg = new Message(messageId);
            msg.setSubject(subject);
            msg.setAttachments(attachments);
            msg.setLabels(labels);
            msg.setDate(new Date(dateStr));
            msg.setSender(senderEmail);
            msg.setSender_domain(senderDomain);
            msg.setMessage_id(messageId);
            msg.setCreated_at(new Date());
            msg.setSender_name(senderName);
            msg.setHas_attachement(hasAttachment);
            msg.setHistory_id(historyId);
            return msg;

        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            Log.e(TAG, "Error parsing metadata", e);
        }
        return null;
    }

    private class MessageResponse{
        private List<Message> messages;
        private Set<String> failed;
        public MessageResponse(List<Message> messages, Set<String> failed) {
            this.messages = messages;
            this.failed = failed;
        }

        public void setMessages(List<Message> messages) {
            this.messages = messages;
        }

        public void setFailed(Set<String> failed) {
            this.failed = failed;
        }

        public List<Message> getMessages() {
            return messages;
        }

        public Set<String> getFailed() {
            return failed;
        }
    }
}

