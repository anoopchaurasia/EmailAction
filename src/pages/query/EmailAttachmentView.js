import React, { useEffect, useState } from "react";
import {View,  StyleSheet, Dimensions, Button} from 'react-native';
import MessageService from "../../realm/EmailMessage";
import QueryService from '../../realm/QueryMessage';

import DataSync from '../../data/DataSync';
import PDFView from 'react-native-pdf';

export default AttachementView = ({selectedEmail, getNext}) => {
    let [selected, setSelected] = useState(selectedEmail);

    let [PDFContent, setPDFContent] = useState(''); 

    useEffect(x=> {
        (async function(){
            console.log(selected)
            setPDFContent(await DataSync.loadAttachment(selected.message_id, selected.attachments[0].id));
        })()
    }, [selected.message_id]);

    function gotToNext() {
        setSelected(getNext())
    }

    async function fetchBody(message_ids) {
        let data =  await DataSync.fetchData(message_ids);
        console.log(data);
        data.map(x=> MessageService.update(x));
    }

    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            
           {PDFContent ? <PDFView
          fadeInDuration={250.0}
            style={styles.pdf}
            password = 'ANOO04DEC'
           
            source={{uri:`data:application/pdf;base64,${PDFContent}`}}
            onLoadComplete={(numberOfPages,filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page,numberOfPages) => {
                console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
                console.log(error);
            }}
            onPressLink={(uri) => {
                console.log(`Link pressed: ${uri}`);
            }}
           
            />: "" }

            <View>
                <Button title="Next" onPress={gotToNext}/>
            </View>
          
        </View>
    )

}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});