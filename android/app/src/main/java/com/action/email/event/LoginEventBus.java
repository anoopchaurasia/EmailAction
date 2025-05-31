package com.action.email.event;

public class LoginEventBus {
    private static LoginEventBus instance;
    private boolean pendingSync = false;

    public static synchronized LoginEventBus getInstance() {
        if (instance == null) instance = new LoginEventBus();
        return instance;
    }

    public void setPendingSync(boolean pending) {
        this.pendingSync = pending;
    }

    public boolean isPendingSync() {
        return pendingSync;
    }
}

