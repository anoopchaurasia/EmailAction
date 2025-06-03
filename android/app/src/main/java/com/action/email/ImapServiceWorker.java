package com.action.email;


public class ImapServiceWorker {

//    public ImapServiceWorker(@NonNull Context context, @NonNull WorkerParameters params) {
//        super(context, params);
//    }
//
//    @NonNull
//    @Override
//    public Result doWork() {
//        if (!isServiceRunning(ImapService.class)) {
//            Intent serviceIntent = new Intent(getApplicationContext(), ImapService.class);
//            ContextCompat.startForegroundService(getApplicationContext(), serviceIntent);
//        }
//
//        return Result.success();
//    }
//
//    private boolean isServiceRunning(Class<?> serviceClass) {
//        ActivityManager manager = (ActivityManager) getApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
//        if (manager == null) return false;
//
//        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
//            if (serviceClass.getName().equals(service.service.getClassName())) {
//                return true;
//            }
//        }
//        return false;
//    }
}

