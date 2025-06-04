package com.action.email;

import static java.lang.Thread.sleep;

import android.content.Context;
import android.util.Log;

import java.util.Properties;

import javax.mail.*;
import javax.mail.event.MessageCountAdapter;
import javax.mail.event.MessageCountEvent;

import com.action.email.data.TokenInfo;
import com.action.email.event.LoginEventBus;
import com.action.email.google.GmailEmailFetcher;

import com.action.email.google.AccessTokenHelper;
import com.action.email.google.GmailHistoryFetcher;
import com.action.email.realm.config.RealmManager;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.firebase.crashlytics.FirebaseCrashlytics;
import com.sun.mail.imap.IMAPFolder;
import com.sun.mail.imap.IMAPMessage;

public class GmailIMAP {

    private static final String HOST = "imap.gmail.com";
    private static final String PORT = "993";
    private static final String TAG = "GmailIMAP";

    private static Store getImapInbox(Context context) throws MessagingException {
        TokenInfo tokenInfo;
        try {
            tokenInfo = AccessTokenHelper.fetchAccessToken(context);
        } catch (Exception e) {
FirebaseCrashlytics.getInstance().recordException(e);
            throw new RuntimeException(e);
        }
        Properties props = new Properties();
        props.setProperty("mail.store.protocol", "imaps");
        props.setProperty("mail.imaps.host", HOST);
        props.setProperty("mail.imaps.port", PORT);
        props.setProperty("mail.imaps.ssl.enable", "true");
        props.setProperty("mail.imaps.auth.mechanisms", "XOAUTH2");

        Session session = Session.getInstance(props);
        Store store = session.getStore("imaps");
        store.connect(HOST, tokenInfo.emailId, tokenInfo.accessToken);

        return store;
    }
    public static void addNewMessageListener(Context context) throws MessagingException {
        GmailHistoryFetcher gmailHistoryFetcher = new GmailHistoryFetcher(context);
        // Keep the connection alive to listen for new messages
        new Thread(() -> {
            try{
            System.out.println("Wait : After start" );
            Store store = null;
            IMAPFolder inbox = null;
            while (true) {
                try {
                    if (store == null || !store.isConnected()) {
                        store = getImapInbox(context);
                        inbox = (IMAPFolder) store.getFolder("INBOX");
                        inbox.open(Folder.READ_ONLY);
                        Log.d(TAG, "Imap socket connected");
                        inbox.addMessageCountListener(new MessageCountAdapter() {
                            @Override
                            public void messagesAdded(MessageCountEvent event) {
                                try {
                                    System.out.println("----------new Message received");
                                    gmailHistoryFetcher.fetchHistoryAndSync();
                                } catch (Exception e) {
                                    FirebaseCrashlytics.getInstance().recordException(e);
                                    throw new RuntimeException(e);
                                }
                            }
                        });
                    }
                    // Enter IDLE mode to wait for new messages
                    inbox.idle();
                } catch (AuthenticationFailedException e) {
                    // Token expired, force reconnect
                    closeSafely(inbox, store);
                    FirebaseCrashlytics.getInstance().recordException(e);
                    inbox = null;
                    store = null;
                    try {
                        Thread.sleep(10000);
                    } catch (InterruptedException ex) {
                        throw new RuntimeException(ex);
                    }
                } catch (FolderClosedException e){
                    e.printStackTrace();
                    closeSafely(inbox, store);
                    FirebaseCrashlytics.getInstance().recordException(e);
                    inbox = null;
                    store = null;
                    try {
                        Thread.sleep(10000);
                    } catch (InterruptedException ex) {
                        throw new RuntimeException(ex);
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                    FirebaseCrashlytics.getInstance().recordException(e);
                    // Optional delay before retry
                    try {
                        Thread.sleep(10000);
                    } catch (InterruptedException ex) {
                        throw new RuntimeException(ex);
                    }
                }
            }
            }   finally {
                RealmManager.closeRealm();
            }
        }).start();
    }

    private static void closeSafely(Folder folder, Store store) {
        try {
            if (folder != null && folder.isOpen()) {
                folder.close(false); // false = don't expunge deleted messages
            }
        } catch (MessagingException e) {
            e.printStackTrace();
            FirebaseCrashlytics.getInstance().recordException(e);
        }

        try {
            if (store != null && store.isConnected()) {
                store.close();
            }
        } catch (MessagingException e) {
            e.printStackTrace();
            FirebaseCrashlytics.getInstance().recordException(e);
        }
    }


    public void connectAndListen(Context context) throws Exception {
        System.out.println("doInBackground: Connected and listening for new emails");
        if (!AccessTokenHelper.isUserLoggedIn(context)) {
            Log.w("GmailImap", "User not logged in. Waiting...");
            // You can send a broadcast or store a pending task flag
            LoginEventBus.getInstance().setPendingSync(true); // custom singleton
            return;
        }
        Log.d(TAG, "connectAndListen");
        try {
            syncAll(context);
            GmailIMAP.addNewMessageListener(context);
        } catch (Exception e) {
            e.printStackTrace();
            FirebaseCrashlytics.getInstance().recordException(e);
        }
        System.out.println("doInBackground: Connected and listening for new emails");
    }

    public void syncAll(Context context) {
        GmailEmailFetcher gmailEmailFetcher= null;
        try {
            gmailEmailFetcher = new GmailEmailFetcher(context);
            gmailEmailFetcher.fetchInboxEmails();
        } catch (Exception e) {
            FirebaseCrashlytics.getInstance().recordException(e);
            throw new RuntimeException(e);
        }
    }
}
