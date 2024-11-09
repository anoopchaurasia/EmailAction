package com.action.email;

import android.os.AsyncTask;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import javax.mail.MessagingException;
import javax.mail.Store;

public class EmailModule extends ReactContextBaseJavaModule {

    public EmailModule(ReactApplicationContext reactContext) {
        super(reactContext);
        GmailIMAP.initializeWebSocketServer();
    }

    @Override
    public String getName() {
        return "EmailModule";
    }

    @ReactMethod
    public void connectToGmail(String userId, String accessToken, Promise promise) {
        new ConnectToGmailTask(userId, accessToken, promise).execute();
    }

    private static class ConnectToGmailTask extends AsyncTask<Void, Void, String> {
        private String userId;
        private String accessToken;
        private Promise promise;

        ConnectToGmailTask(String userId, String accessToken, Promise promise) {
            this.userId = userId;
            this.accessToken = accessToken;
            this.promise = promise;
        }

        @Override
        protected String doInBackground(Void... voids) {
            try {
                System.out.println("doInBackground: Connected and listening for new emails");
                Store store = GmailIMAP.connectToGmail(userId, accessToken);
                GmailIMAP.addNewMessageListener(store);
                System.out.println("doInBackground: Connected and listening for new emails");
                return "Connected and listening for new emails";
            } catch (MessagingException e) {
                 System.out.println("doInBackground Error: Connected and listening for new emails");
                return "Error: " + e.getMessage();
            }
        }

        @Override
        protected void onPostExecute(String result) {
            if (result.startsWith("Error:")) {
                promise.reject("Error", result);
            } else {
                promise.resolve(result);
            }
        }
    }
}
