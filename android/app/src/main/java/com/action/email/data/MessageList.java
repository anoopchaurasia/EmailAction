package com.action.email.data;

import java.util.List;

public class MessageList {
    private List<String> messageIds;
    private String pageToken;

    public MessageList(List<String> messageIds, String pageToken) {
        this.messageIds = messageIds;
        this.pageToken = pageToken;
    }

    public List<String> getMessageIds() {
        return messageIds;
    }

    public String getPageToken() {
        return pageToken;
    }
    public void setMessageIds(List<String> messageIds) {
        this.messageIds = messageIds;
    }

    public void setPageToken(String pageToken) {
        this.pageToken = pageToken;
    }
}