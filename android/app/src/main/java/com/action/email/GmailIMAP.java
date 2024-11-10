package com.action.email;

import java.util.Properties;
import javax.mail.*;
import javax.mail.event.MessageCountAdapter;
import javax.mail.event.MessageCountEvent;
import java.net.InetSocketAddress;
import org.java_websocket.server.WebSocketServer;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

public class GmailIMAP {

    private static final String HOST = "imap.gmail.com";
    private static final String PORT = "993";
    private static EmailWebSocketServer webSocketServer;

    public static Store connectToGmail(String userId, String accessToken) throws MessagingException {
        Properties props = new Properties();
        props.setProperty("mail.store.protocol", "imaps");
        props.setProperty("mail.imaps.host", HOST);
        props.setProperty("mail.imaps.port", PORT);
        props.setProperty("mail.imaps.ssl.enable", "true");
        props.setProperty("mail.imaps.auth.mechanisms", "XOAUTH2");

        Session session = Session.getInstance(props);
        Store store = session.getStore("imaps");
        store.connect(HOST, userId, accessToken);
        return store;
    }

    public static void addNewMessageListener(Store store) throws MessagingException {
        Folder inbox = store.getFolder("INBOX");
        inbox.open(Folder.READ_ONLY);

        System.out.println("addNewMessageListener: Open Inbox");
        sendNewMessageToJS("Sending first message to test");
        inbox.addMessageCountListener(new MessageCountAdapter() {
            @Override
            public void messagesAdded(MessageCountEvent event) {
                Message[] messages = event.getMessages();
                try {
                    sendNewMessageToJS(messagesToJson(messages));
                    System.out.println("addNewMessageListener: Open Inbox messagesAdded");
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
                
            }
        });

        // Keep the connection alive to listen for new messages
        while (true) {
            try {
                Thread.sleep(10000); // Check for new messages every 10 seconds
                inbox.getMessageCount(); // Trigger the listener
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    private static void sendNewMessageToJS(String message) {
        if (webSocketServer != null) {
            System.out.println("sendNewMessageToJS, sendMessageToAll "+ message);
            webSocketServer.sendMessageToAll(message);
        } else {
            System.out.println("webSocketServer is not available");
        }

    }

    public static void initializeWebSocketServer() {
        InetSocketAddress address = new InetSocketAddress("localhost", 8765);
        webSocketServer = new EmailWebSocketServer(address);
        webSocketServer.start();
    }

    
    public static String messagesToJson(Message[] messages) throws Exception {
        JSONArray messageArray = new JSONArray();

        for (Message message : messages) {
            JSONObject emailJson = new JSONObject();

            emailJson.put("from", message.getFrom() != null ? message.getFrom()[0].toString() : "");
            emailJson.put("subject", message.getSubject());
            emailJson.put("content", message.getContent() instanceof String ? message.getContent() : "Non-text content");

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
