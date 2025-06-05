package com.action.email;

import com.action.email.realm.reactmodule.ActivityModule;
import com.action.email.realm.reactmodule.LabelModule;
import com.action.email.realm.reactmodule.MessageAggregateModule;
import com.action.email.realm.reactmodule.MessageModule;
import com.action.email.realm.reactmodule.NativeNotifierModule;
import com.action.email.realm.reactmodule.QueryModule;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class EmailModulePackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new EmailModule(reactContext));
        modules.add(new MessageAggregateModule(reactContext));
        modules.add(new MessageModule(reactContext));
        modules.add(new ActivityModule(reactContext));
        modules.add(new QueryModule(reactContext));
        modules.add(new LabelModule(reactContext));
        modules.add(new NativeNotifierModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
