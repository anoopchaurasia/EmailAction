package com.action.email;

import java.util.Properties;
import javax.mail.*;
import javax.mail.event.MessageCountAdapter;
import javax.mail.event.MessageCountEvent;
import java.net.InetSocketAddress;
import org.java_websocket.server.WebSocketServer;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;

import com.action.email.google.GmailEmailFetcher;
import com.facebook.react.bridge.ReactApplicationContext;

import org.json.JSONArray;
import org.json.JSONObject;

import com.action.email.google.AccessTokenHelper;

public class GmailIMAP {

    private static final String HOST = "imap.gmail.com";
    private static final String PORT = "993";
    private static EmailWebSocketServer webSocketServer;
    private static String accessToken ;

    public static Store connectToGmail(String userId, ReactApplicationContext reactContext) throws MessagingException {
        Properties props = new Properties();
        props.setProperty("mail.store.protocol", "imaps");
        props.setProperty("mail.imaps.host", HOST);
        props.setProperty("mail.imaps.port", PORT);
        props.setProperty("mail.imaps.ssl.enable", "true");
        props.setProperty("mail.imaps.auth.mechanisms", "XOAUTH2");

        Session session = Session.getInstance(props);
        Store store = session.getStore("imaps");
        AccessTokenHelper.fetchAccessToken(reactContext, new AccessTokenHelper.TokenCallback() {
            @Override
            public void onTokenReceived(String token) {
                try {
                  //  store.connect(HOST, userId, token);
                    accessToken = token;
                    System.out.println("Wait: Connected to Gmail IMAP server");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            @Override
            public void onError(Exception e) {
                e.printStackTrace();
            }
        });
        return store;
    }

    public static void addNewMessageListener(Store store) throws MessagingException {
        // Folder inbox = store.getFolder("INBOX");
        // inbox.open(Folder.READ_ONLY);

        // System.out.println("addNewMessageListener: Open Inbox");
        // sendNewMessageToJS("Sending first message to test");
        // inbox.addMessageCountListener(new MessageCountAdapter() {
        //     @Override
        //     public void messagesAdded(MessageCountEvent event) {
        //         Message[] messages = event.getMessages();
        //         try {
        //             sendNewMessageToJS(messagesToJson(messages));
        //             System.out.println("addNewMessageListener: Open Inbox messagesAdded");
        //         } catch (MessagingException e) {
        //             e.printStackTrace();
        //         } catch (Exception e) {
        //             e.printStackTrace();
        //         }
        //     }
        // });

        // Keep the connection alive to listen for new messages
        new Thread(() -> {
           // while (true) {
                try {
                    System.out.println("Wait : Before start");
                    Thread.sleep(10000);
                    System.out.println("Wait : After start" + accessToken);
                    GmailEmailFetcher gmailEmailFetcher= new GmailEmailFetcher(accessToken);
                    gmailEmailFetcher.fetchInboxEmails();
                   // Thread.sleep(10000); // Check for new messages every 10 seconds
                    //inbox.getMessageCount(); // Trigger the listener
                } catch (Exception e) {
                    e.printStackTrace();
                    //break; // Exit the loop if interrupted
                }
           // }
        }).start();
    }

    private static void sendNewMessageToJS(String message) {
        if (webSocketServer != null) {
            try {
                System.out.println("sendNewMessageToJS, sendMessageToAll " + message);
                LocalNotification.sendNotification(MainApplication.instance);
                webSocketServer.sendMessageToAll(message);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("webSocketServer is not available");
        }
    }

    public static void initializeWebSocketServer() {
        InetSocketAddress address = new InetSocketAddress("localhost", 8888);
        webSocketServer = new EmailWebSocketServer(address);
        webSocketServer.start();
    }

    public static String messagesToJson(Message[] messages) throws Exception {
        JSONArray messageArray = new JSONArray();

        for (Message message : messages) {
            JSONObject emailJson = new JSONObject();

            emailJson.put("from", message.getFrom() != null ? message.getFrom()[0].toString() : "");
            emailJson.put("subject", message.getSubject());
            Object content = message.getContent();
            if (content instanceof String) {
                emailJson.put("content", content);
            } else {
                emailJson.put("content", "Non-text content");
            }

            messageArray.put(emailJson);
        }

        return messageArray.toString();
    }
}

class EmailWebSocketServer extends WebSocketServer {

    public EmailWebSocketServer(InetSocketAddress address) {
        super(address);
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("New connection: " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        System.out.println("Closed connection: " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        System.out.println("Received message: " + message);
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        ex.printStackTrace();
    }

    @Override
    public void onStart() {
        System.out.println("Server started successfully");
    }

    public void sendMessageToAll(String messages) {
        for (WebSocket conn : getConnections()) {
            conn.send(messages);
        }
    }

}
