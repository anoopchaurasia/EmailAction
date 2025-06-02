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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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



   public static void moveToFolder(Activity task, List<String> messageIds, String accessToken) {
       try {
           LabelManager.moveToFolder(task, messageIds, accessToken);
       } catch (Exception e) {
           Log.e("ProcessRules", "Move failed", e);
       }
   }

   public static void copyToFolder(Activity task, List<String> messageIds, String accessToken) {
       try {
           LabelManager.copyToFolder(task, messageIds, accessToken);
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
            applyRule(activity, messageIds, accessToken);
            gmailHistoryFetcher.fetchHistoryAndSync();
        } while (pageToken != null);
   }

   private static void applyRule(Activity activity, List<String> messageIds, String accessToken) {
       Log.d(TAG, "message length: " +  messageIds.size());
       switch (activity.getAction()) {
           case "trash":
               trash(activity, messageIds, accessToken);

               break;
           case "move":
               moveToFolder(activity, messageIds, accessToken);
               break;
           case "copy":
               copyToFolder(activity, messageIds, accessToken);
               break;
       }

   }


    public static void takeActionOnNewMessages(List<Message> messages, Context context)  {
        List<Activity> rules = ActivityService.getAll();

        Map<Activity, List<String>> appliedRules = new HashMap<>();

        for (Message message : messages) {
            for (Activity rule : rules) {
                if (matches(message, rule)) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                        appliedRules
                                .computeIfAbsent(rule, r -> new ArrayList<>())
                                .add(message.getMessage_id());
                    }
                    break; // Only one rule per message
                }
            }
        }

        for (Map.Entry<Activity, List<String>> entry : appliedRules.entrySet()) {
            Activity rule = entry.getKey();
            List<String> messageIds = entry.getValue();
            try {
                applyRule(rule, messageIds, AccessTokenHelper.fetchAccessToken(context).accessToken);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

       // return appliedRules;
    }



    private static boolean matches(Message message, Activity rule) {
        switch (rule.getType()) {
            case "sender":
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    return rule.getFrom().stream()
                            .noneMatch(x -> x.equalsIgnoreCase(message.getSender()));
                }
            case "domain":
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    return  rule.getFrom().stream()
                            .noneMatch(x -> x.equalsIgnoreCase(message.getSender_domain()));
                }
            default:
                return false;
        }
   }
}

