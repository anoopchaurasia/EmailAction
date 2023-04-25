import React, { useEffect, useState } from "react";
import {View,  StyleSheet, Dimensions, Button, Text} from 'react-native';
import MessageService from "../../realm/EmailMessage";
import QueryService from '../../realm/QueryMessage';

import DataSync from '../../data/DataSync';
import PDFView from 'react-native-pdf';

export default AttachementView = ({selectedEmail, password, getNext, getPrev, onClose}) => {
    let [selected, setSelected] = useState(selectedEmail);

    let [PDFContent, setPDFContent] = useState(''); 

    useEffect(x=> {
        (async function(){
            console.log(selected)
            setPDFContent(await DataSync.loadAttachment(selected.message_id, selected.attachments[0].id));
        })()
    }, [selected.message_id]);

    function goToNext() {
        setSelected(getNext())
    }

    function goToPrev() {
        setSelected(getPrev())
    }

    async function fetchBody(message_ids) {
        let data =  await DataSync.fetchData(message_ids);
        console.log(data);
        data.map(x=> MessageService.update(x));
    }
    console.log(selected)
    return (
        <View style={{ flex: 1, flexDirection: "column", backgroundColor:'white' }}>
            <View>
                <Text>
                    {selected.subject}
                </Text>
                <Text>
                    {selected.sender}
                </Text>
                <Text>
                    {selected.date.toISOString()}
                </Text>
            </View>
           {PDFContent ? <PDFView
          fadeInDuration={250.0}
            style={styles.pdf}
            password = {password|| 'ANOO04DEC'}
           
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

            <View style={{flexDirection:"row", width:"100%"}}>
                <Button style={{flex:1, margin: 10}} title="Prev" onPress={goToPrev}/>
                <Button style={{flex:1, margin: 10}} title="Next" onPress={goToNext}/> 
                <Button style={{flex:1, margin: 10}} title="Close" onPress={onClose}/>
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