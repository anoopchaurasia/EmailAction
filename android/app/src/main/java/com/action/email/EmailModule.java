package com.action.email;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.util.Log;

import com.action.email.event.LoginEventBus;
import com.action.email.google.AccessTokenHelper;
import com.action.email.google.GmailHistoryFetcher;
import com.action.email.google.GmailLabelFetcher;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.mail.MessagingException;
import javax.mail.Store;

public class EmailModule extends ReactContextBaseJavaModule {

    private static final String TAG = "EmailModule" ;

    public EmailModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "EmailModule";
    }

    @ReactMethod
    public void connectToGmail(Promise promise) {
        GmailHistoryFetcher gmailHistoryFetcher = new GmailHistoryFetcher(getReactApplicationContext());
        try {
            Log.d(TAG, "connectToGmail");
            GmailLabelFetcher.fetchLabels(getReactApplicationContext());
            gmailHistoryFetcher.fetchHistoryAndSync();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        ;
        System.out.println("------------------------------connectToGmail");
        if (LoginEventBus.getInstance().isPendingSync()) {
            System.out.println("connectToGmail start service");
            Context context = getReactApplicationContext().getApplicationContext();
            context.startForegroundService(new Intent(context, ImapService.class));
        }
    }

}
