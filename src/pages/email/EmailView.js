import { useEffect, useState } from "react";
import DataSync from '../../data/DataSync';
import { View, Text } from "react-native";
import base64 from 'react-native-base64';
import { WebView } from 'react-native-webview';


export default BySenderView = ({navigation, route}) => {
    console.log(route?.params?.message_id, "route?.params?.message_id");
    let [email, setEmail] = useState("");
    let [html, setHTML] = useState("");
    useEffect(x=> {
        DataSync.getMessagebById(route.params?.message_id).then(x=> {
            console.log(x.mimeType,"-----------------------");
            extractMultipartFromJSON(x);
        });
    }, []);

    function extractMultipartFromJSON(json) {

        if(json.mimeType!="text/html") {return json.parts && json.parts.forEach(x=> extractMultipartFromJSON(x)) }
        b64DecodeUnicode(json.body?.data);
    }

    function b64DecodeUnicode(text) {
       

        let html = base64.decode(text.replace(/\-/g, '+').replace(/_/g, '/') + '=='.substring(0, (3 * text.length) % 4));
        setHTML(html);
        return html;
    }

    return (
           <WebView
            originWhitelist={['*']}
            source={{ html: html|| '<h1>loading...</h1>' }}
            />
    )

}

