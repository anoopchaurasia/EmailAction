package com.action.email.google;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

import com.google.android.gms.auth.GoogleAuthUtil;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.common.Scopes;

import java.io.IOException;

public class AccessTokenHelper {

    public interface TokenCallback {
        void onTokenReceived(String token);
        void onError(Exception e);
    }

    public static void fetchAccessToken(Context context, TokenCallback callback) {
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(context);

        if (account == null || account.getAccount() == null) {
            callback.onError(new Exception("No signed-in account found"));
            return;
        }

        new AsyncTask<Void, Void, String>() {
            Exception exception;

            @Override
            protected String doInBackground(Void... voids) {
                try {
                    String scope = "oauth2:" + Scopes.EMAIL + " " + Scopes.PROFILE;
                    return GoogleAuthUtil.getToken(context, account.getAccount(), scope);
                } catch (IOException | com.google.android.gms.auth.GoogleAuthException e) {
                    exception = e;
                    e.printStackTrace();
                    return null;
                }
            }

            @Override
            protected void onPostExecute(String token) {
                if (token != null) {
                    callback.onTokenReceived(token);
                } else {
                    callback.onError(exception);
                }
            }
        }.execute();
    }
}
