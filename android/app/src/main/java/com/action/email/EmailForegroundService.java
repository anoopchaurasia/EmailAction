package com.action.email;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import androidx.core.app.NotificationCompat;

import java.net.InetSocketAddress;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class EmailForegroundService extends Service {

    private static final String CHANNEL_ID = "EmailServiceChannel";
    private EmailWebSocketServer webSocketServer;
    private ExecutorService executorService;
    private Handler handler;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        startForeground(1, getNotification());

        executorService = Executors.newSingleThreadExecutor();
        handler = new Handler(Looper.getMainLooper());
        System.out.println("EmailForegroundService on create");

        executorService.execute(() -> {
            InetSocketAddress address = new InetSocketAddress("localhost", 8888);
            webSocketServer = new EmailWebSocketServer(address);
            webSocketServer.start();
            System.out.println("WebSocket server started in EmailForegroundService");
        });
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (webSocketServer != null) {
            executorService.execute(() -> {
                try {
                    webSocketServer.stop();
                                    System.out.println("WebSocket server stopped in EmailForegroundService");
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            });
        }
        executorService.shutdown();
            System.out.println("EmailForegroundService destroyed");

    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @SuppressLint("NewApi")
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                CHANNEL_ID,
                "Email Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            );

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
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
