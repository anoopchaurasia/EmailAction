package com.action.email;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.nfc.Tag;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.action.email.event.LoginEventBus;

public class ImapService extends Service {

    public static final String CHANNEL_ID = "IMAPServiceChannel";
    public static final String TAG = "ImapService";
    @Override
    public void onCreate() {

        Log.d(TAG, "onCreate");
        super.onCreate();
        startForegroundService();
        System.out.println("onCreate IMAP Service");
        startImapListener();
    }

    private void startForegroundService() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "IMAP Listener Service",
                    NotificationManager.IMPORTANCE_LOW
            );
            Log.d(TAG, "startForegroundService");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Listening for new emails")
                .setContentText("IMAP socket connected")
                .setSmallIcon(R.drawable.ic_launcher_background) // replace with your icon
                .build();

        startForeground(1, notification);
    }

    private void startImapListener() {
        new Thread(() -> {
            try {
                GmailIMAP imap = new GmailIMAP();
                imap.connectAndListen(getApplicationContext()); // you'll implement this in the next step
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand");
        if(LoginEventBus.getInstance().isPendingSync()) {
            Log.d(TAG, "Pending sync detected, starting IMAP listener");
            LoginEventBus.getInstance().setPendingSync(false);
            startImapListener();
        } else {
            Log.w(TAG, "No pending sync, not starting IMAP listener");
        } 
        return START_STICKY; // Restart if killed by system
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // Optionally close IMAP connection
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}

