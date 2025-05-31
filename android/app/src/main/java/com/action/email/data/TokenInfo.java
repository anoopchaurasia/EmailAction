package com.action.email.data;

public class TokenInfo {
    public String emailId;
    public String accessToken;

    public TokenInfo(String emailId, String accessToken) {
        this.emailId = emailId;
        this.accessToken = accessToken;
    }
}