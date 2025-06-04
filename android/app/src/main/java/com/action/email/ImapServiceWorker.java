package com.action.email;



import android.content.Context;
import android.content.Intent;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.work.ListenableWorker;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import android.app.ActivityManager;

import com.action.email.google.GmailHistoryFetcher;


public class ImapServiceWorker extends Worker {
    public ImapServiceWorker(@NonNull Context context, @NonNull WorkerParameters params) {
        super(context, params);

    }

    @NonNull
    @Override
    public ListenableWorker.Result doWork() {
        if (!isServiceRunning(ImapService.class)) {
            Intent serviceIntent = new Intent(getApplicationContext(), ImapService.class);
            ContextCompat.startForegroundService(getApplicationContext(), serviceIntent);
        }

        GmailHistoryFetcher gmailHistoryFetcher = new GmailHistoryFetcher(getApplicationContext());
        try {
            gmailHistoryFetcher.fetchHistoryAndSync();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        ;

        return ListenableWorker.Result.success();
    }

    private boolean isServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) getApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);;
        if (manager == null) return false;

        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }
}

