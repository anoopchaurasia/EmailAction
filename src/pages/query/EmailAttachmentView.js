import React, { useEffect, useState } from "react";
import {View,  StyleSheet, Dimensions, ActivityIndicator, Text} from 'react-native';
import BottomBar from './../component/BottomBarView';
import DataSync from '../../data/DataSync';
import PDFView from 'react-native-pdf';

export default AttachementView = ({selectedEmail, password, getNext, getPrev, onClose}) => {

    let [selected, setSelected] = useState(selectedEmail);

    let [PDFContent, setPDFContent] = useState(''); 
    let actionList = [{
        name: "Prev", 
        icon:"page-previous-outline",
        action: x=>goToPrev()
    }, {
        name:"Next", 
        icon:"page-next-outline", 
        action: x=>goToNext()
    }];


    useEffect(x=> {
        (async function(){
            setPDFContent(await DataSync.loadAttachment(selected.message_id, selected.attachments[0].id));
        })()
    }, [selected.message_id]);

    async function goToNext() {
        setPDFContent("")
        setSelected(await getNext())
    }

    async function goToPrev() {
        setPDFContent("")
        setSelected(await getPrev())
    }

    return (
        <View style={{ flex: 1, flexDirection: "column", backgroundColor:'white' }}>
            <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text>{selected.sender_name}</Text>
            <Text style={{ fontWeight: 'bold' }}>{selected.subject}</Text>
            <Text>{(selected.date.toString())}</Text>
            <Text>{selected.labels.join(', ')}</Text>
            {selected.attachments.map(x=> <Text>{x.name}</Text>)}
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
           
            />: <View style={{flex:1, alignItems:"center", alignContent:"center",}}><ActivityIndicator style={{alignSelf:"center", marginTop:"75%"}} size="large" color="#0000ff" /></View> }
            <BottomBar visible={true} style={{backgroundColor:"#ccc"}} list={actionList} />
          
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