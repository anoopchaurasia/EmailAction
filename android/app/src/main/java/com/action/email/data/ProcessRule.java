package com.action.email.data;

// This is a Java translation of the provided JavaScript-based ProcessRules logic
// Dependencies assumed: ActivityService, MessageService, LabelManager (you previously created), DataSync

import android.content.Context;
import android.os.Build;
import android.util.Log;

import com.action.email.google.AccessTokenHelper;
import com.action.email.google.GmailEmailFetcher;
import com.action.email.google.GmailHistoryFetcher;
import com.action.email.google.GmailQueryBuilder;
import com.action.email.google.LabelManager;
import com.action.email.realm.model.Activity;
import com.action.email.realm.model.Message;
import com.action.email.realm.service.ActivityService;
import com.action.email.realm.service.MessageService;

import java.util.List;

public class ProcessRule {
    private static final int MAX_RETRIES = 4;
    private static final String TAG = "ProcessRule";
//   public static void process() {
//       List<Activity> pendingTasks = ActivityService.getNoCompleted();
//       for (Activity task : pendingTasks) {
//           if (task.getFrom() == null || task.getFrom().isEmpty()) {
//               Log.e("ProcessRules", "Filter is not present, it should contain at least one sender email");
//               break;
//           }
//
//           Log.i("ProcessRules", String.format("%s %s %s %s", task.getAction(), task.getFrom_label(), task.getTo_label(), task.getFrom()));
//
//           switch (task.getAction()) {
//               case "trash":
//                   trash(task, null, accessToken);
//                   break;
//               case "move":
//                   moveToFolder(task, null);
//                   break;
//               case "copy":
//                   copyToFolder(task, null);
//                   break;
//               default:
//                   Log.i("ProcessRules", "No action defined: " + task);
//           }
//           task.setRan_at(new Date());
//           task.setCompleted(true);
//           ActivityService.update(task);
//       }
//   }

   public static void trash(Activity task, List<String> messageIds, String accessToken) {
       try {
           LabelManager.trash(task, messageIds, accessToken);

       } catch (Exception e) {
           Log.e("ProcessRules", "Trash failed", e);
       }
   }



   public static void moveToFolder(Activity task, List<String> messageIds) {
       try {
          // LabelManager.moveToFolder(task, messageIds);
       } catch (Exception e) {
           Log.e("ProcessRules", "Move failed", e);
       }
   }

   public static void copyToFolder(Activity task, List<String> messageIds) {
       try {
           //LabelManager.copyToFolder(task);
       } catch (Exception e) {
           Log.e("ProcessRules", "Move failed", e);
       }
   }




    public static void takeAction(Activity activity, Context context) throws Exception {
       String gmailQuery = new GmailQueryBuilder().setFrom(activity.getFrom().get(0)).setLabel("inbox").build();
        GmailEmailFetcher gmailEmailFetcher = new GmailEmailFetcher(context);
        GmailHistoryFetcher gmailHistoryFetcher = new GmailHistoryFetcher(context);
        String pageToken = null;
        int attempt = 0;
        Log.d(TAG, "activity: "+ activity.getAction() + " from: " + activity.getFrom().get(0));
        Log.d(TAG, "query: " +  gmailQuery);
        do {
            String accessToken = AccessTokenHelper.fetchAccessToken(context).accessToken;
            MessageList messageList = gmailEmailFetcher .getMessageIDs(pageToken, gmailQuery);
            List<String> messageIds = messageList.getMessageIds();

            pageToken = messageList.getPageToken();
            if(messageIds == null) {
                if(attempt>= MAX_RETRIES) return;
                attempt += 1;
                continue;
            }
            Log.d(TAG, "message length: " +  messageIds.size());
            switch (activity.getAction()) {
                case "trash":
                    trash(activity, messageIds, accessToken);
                    gmailHistoryFetcher.fetchHistoryAndSync();
                    break;
                case "move":
                    moveToFolder(activity, messageIds);
                    break;
                case "copy":
                    copyToFolder(activity, messageIds);
                    break;
            }
        } while (pageToken != null);
   }


}

