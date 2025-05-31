package com.action.email.google;

import android.util.Log;

import com.action.email.realm.model.Activity;
import com.action.email.realm.model.Message;
import com.google.gson.Gson;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import okhttp3.Response;

public class LabelManager {
    private static final String TAG = "LabelManager";
    private static final int BATCH_SIZE = 25;

    public interface ProcessCallback {
        void onProcessed(List<Map<String, Object>> processedMessages);
    }

    public static List<Message> trash(Activity task, List<String> messageIds, String accessToken) {
      return  LabelManager.changeLabel(messageIds,
                accessToken,
                "trash", new ArrayList<>(), new ArrayList<>());
    }

    private static List<Message> changeLabel (List<String> messageIds, String accessToken ,String labelName,
                                              List<String> addLabels, List<String> removeLabels ) {
        final int BATCH_SIZE = 25;
        final String label = labelName.equals("trash")? labelName : "modify";
        for (int i = 0; i < messageIds.size(); i += BATCH_SIZE) {
            Log.d(TAG, "Processing " + i + " to " + Math.min(i + BATCH_SIZE, messageIds.size()) + " of " + messageIds.size());

            List<String> batch = messageIds.subList(i, Math.min(i + BATCH_SIZE, messageIds.size()));
            Set<String> failedIds = new HashSet<>();
            return GmailBatchRequestSender.sendBatchRequest(
                    messageIds,
                    id -> "POST /gmail/v1/users/me/messages/" + id + "/"+label,
                    id -> Map.of("Content-Type", "application/json"),
                    id -> new Gson().toJson(Map.of(
                            "addLabelIds", addLabels,
                            "removeLabelIds", removeLabels
                    )),
                    accessToken
            );


        }
        return null;
    }


   // public static void create(String name) {
//        Gmail.createLabel(name);
//    }

//    public static void moveToFolder(Task task, List<String> messageIds, String accessToken) {
//        changeLabel(messageIds, accessToken, "", List.of(task.toLabel), List.of(task.fromLabel));
//    }
//
//    public static void copyToFolder(Task task, List<String> messageIds, String accessToken) {
//        changeLabel(messageIds, accessToken, "", List.of(task.toLabel), new ArrayList<>());
//    }

    public static class Task {
        public String fromLabel;
        public String toLabel;

        public Task(String fromLabel, String toLabel) {
            this.fromLabel = fromLabel;
            this.toLabel = toLabel;
        }
    }
}
