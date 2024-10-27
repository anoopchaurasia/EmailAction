package com.action.email;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;

import java.net.InetSocketAddress;

public class EmailForegroundService extends Service {

    private static final String CHANNEL_ID = "EmailServiceChannel";
    private EmailWebSocketServer webSocketServer;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        startForeground(1, getNotification());

        InetSocketAddress address = new InetSocketAddress("localhost", 8080);
        webSocketServer = new EmailWebSocketServer(address);
        webSocketServer.start();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (webSocketServer != null) {
            try {
                webSocketServer.stop();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @SuppressLint("NewApi")
    private void createNotificationChannel() {
        NotificationChannel serviceChannel = null;
            serviceChannel = new NotificationChannel(
                CHANNEL_ID,
                "Email Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            );

        NotificationManager manager = null;
            manager = getSystemService(NotificationManager.class);

        if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
                   }
    }

    private Notification getNotification() {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Email Service")
            .setContentText("Listening for new emails")
            .setSmallIcon(R.drawable.ic_launcher_background)
            .build();
    }
}
