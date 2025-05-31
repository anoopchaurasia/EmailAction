package com.action.email.google;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class GmailQueryBuilder {

    private String from;
    private String to;
    private String subject;
    private Boolean hasAttachment;
    private Date afterDate;
    private Date beforeDate;
    private String label;

    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd", Locale.US);

    public GmailQueryBuilder setFrom(String from) {
        this.from = from;
        return this;
    }

    public GmailQueryBuilder setTo(String to) {
        this.to = to;
        return this;
    }

    public GmailQueryBuilder setSubject(String subject) {
        this.subject = subject;
        return this;
    }

    public GmailQueryBuilder setHasAttachment(Boolean hasAttachment) {
        this.hasAttachment = hasAttachment;
        return this;
    }

    public GmailQueryBuilder setAfterDate(Date afterDate) {
        this.afterDate = afterDate;
        return this;
    }

    public GmailQueryBuilder setBeforeDate(Date beforeDate) {
        this.beforeDate = beforeDate;
        return this;
    }

    public GmailQueryBuilder setLabel(String label) {
        this.label = label;
        return this;
    }

    public String build() {
        StringBuilder query = new StringBuilder();

        if (from != null && !from.isEmpty()) {
            query.append("from:(").append(from).append(") ");
        }
        if (to != null && !to.isEmpty()) {
            query.append("to:(").append(to).append(") ");
        }
        if (subject != null && !subject.isEmpty()) {
            query.append("subject:(").append(subject).append(") ");
        }
        if (hasAttachment != null && hasAttachment) {
            query.append("has:attachment ").append(" ");
        }
        if (afterDate != null) {
            query.append("after:").append(sdf.format(afterDate)).append(" ");
        }
        if (beforeDate != null) {
            query.append("before:").append(sdf.format(beforeDate)).append(" ");
        }
        if (label != null && !label.isEmpty()) {
            query.append("in:").append(label).append(" ");
        }

        return query.toString().trim();
    }
}
