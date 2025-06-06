import { useEffect, useState } from "react";
import DataSync from '../../data/DataSync';
import { View, Text } from "react-native";
import base64 from 'react-native-base64';
import { WebView } from 'react-native-webview';
import extractDetailsFromHTML from "./../../utility/AI"


export default EmailView = ({navigation, route}) => {
    console.log(route?.params?.message_id, "route?.params?.message_id");
    let [email, setEmail] = useState("");
    let [html, setHTML] = useState("");
    useEffect(x=> {
        console.log("EmailView useEffect", route.params?.message_id);
        DataSync.getMessagebById(route.params?.message_id).then(x=> {
            setEmail(x);
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
     //   extractDetailsFromHTML(html, email.sender);
        return html;
    }
    if(html){
        html = addUtf8Meta(html);
    }
    return (
           <WebView
            originWhitelist={['*']}
            source={{ html: html|| '<h1>loading...</h1>' }}
              javaScriptEnabled={false}
                scalesPageToFit={true}
                domStorageEnabled={false}
                startInLoadingState={true}
                automaticallyAdjustContentInsets={false}
            />
    )

}

function addUtf8Meta(html) {
  const metaTag = '<meta charset="UTF-8">';
  
  if (/<head[^>]*>/i.test(html)) {
    // If <head> exists, inject the meta tag right after it
    return html.replace(/<head[^>]*>/i, match => `${match}\n  ${metaTag}`);
  } else if (/<html[^>]*>/i.test(html)) {
    // If only <html> exists, inject <head> with meta
    return html.replace(/<html[^>]*>/i, match => `${match}\n<head>${metaTag}</head>`);
  } else {
    // If neither <html> nor <head>, wrap with full HTML
    return `
      <html>
        <head>${metaTag}</head>
        <body>${html}</body>
      </html>
    `;
  }
}