package com.action.email.google;
import android.content.Context;

import com.action.email.data.TokenInfo;
import com.google.android.gms.auth.GoogleAuthUtil;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;

public class AccessTokenHelper {
    private static final String GMAIL_SCOPE = "https://mail.google.com/";
    private static final long TOKEN_VALIDITY_MILLIS = 57 * 60 * 1000; // 57 minutes

    private static TokenInfo cachedTokenInfo = null;
    private static long lastFetchedTime = 0;

    public static synchronized TokenInfo fetchAccessToken(Context context) throws Exception {
        long currentTime = System.currentTimeMillis();

        if (cachedTokenInfo != null && (currentTime - lastFetchedTime) < TOKEN_VALIDITY_MILLIS) {
            return cachedTokenInfo; // Return cached token if still valid
        }

        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(context);

        if (account == null || account.getAccount() == null) {
            throw new Exception("No signed-in account found");
        }

        String email = account.getEmail();
        String scope = "oauth2:" + GMAIL_SCOPE;
        String token = GoogleAuthUtil.getToken(context, account.getAccount(), scope);

        cachedTokenInfo = new TokenInfo(email, token);
        lastFetchedTime = currentTime;

        return cachedTokenInfo;
    }

    public static boolean isUserLoggedIn(Context context) {
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(context);

        return account != null && account.getAccount() != null;
    }
}