import React, { useEffect, useState } from "react";
import {View,  StyleSheet, Dimensions, ActivityIndicator, Text} from 'react-native';
import BottomBar from './../component/BottomBarView';
import DataSync from '../../data/DataSync';
import PDFView from 'react-native-pdf';
import MyText from './../component/MyText';
import { useTheme } from '@react-navigation/native';


export default AttachementView = ({selectedEmail, password, getNext, getPrev, onClose}) => {
    console.log(selectedEmail);
    let colors = useTheme().colors;
    let [selected, setSelected] = useState(selectedEmail);

    let [PDFContent, setPDFContent] = useState([]); 
    let actionList = [{
        name: "Prev", 
        icon:"page-previous-outline",
        action: x=>goToPrev()
    }, {
        name:"Next", 
        icon:"page-next-outline", 
        action: x=>goToNext()
    }];

    function getType(filename) {
        if(filename.match(/\.pdf$/igm)) return 'pdf'
        if(filename.match(/\.(png|jpeg|jpg)$/igm)) return 'image'
        return 'others'
    }

    useEffect(x=> {
        (async function(){
            let arr = [];
            for(let i=0; i< selected.attachments.length; i++) {
                let attachement = selected.attachments[i];
                let type = getType(selected.attachments[i].name);
                arr.push({
                    attachement: attachement,
                    type: type,
                    data:  (type=='pdf' || type=='image') && await DataSync.loadAttachment(selected.message_id, attachement.id)
                });
                //console.log(arr, '-----------------------')
            }
            setPDFContent(arr);
        })()
    }, [selected.message_id]);

    async function goToNext() {
        setPDFContent([])
        setSelected(await getNext())
    }

    async function goToPrev() {
        setPDFContent([])
        setSelected(await getPrev())
    }

    return (
        <View style={{ flex: 1, flexDirection: "column", backgroundColor:'white' }}>
            <View style={{ padding: 10, borderBottomWidth: 1, borderColor: colors.border }}>
            <MyText>{selected.sender_name}</MyText>
            <MyText style={{ fontWeight: 'bold' }}>{selected.subject}</MyText>
            <MyText>{(selected.date.toString())}</MyText>
            <MyText>{selected.labels.join(', ')}</MyText>
            {selected.attachments.map(x=> <MyText>{x.name}</MyText>)}
            </View>
           {PDFContent.length ? PDFContent.map(content=> content.type==='pdf'? <PDFView
          fadeInDuration={250.0}
            style={styles.pdf}
            password = {password}
           
            source={{uri:`data:application/pdf;base64,${content.data}`}}
            onLoadComplete={(numberOfPages) => {
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
           
            /> : content.type==='image' ? <MyText>Image {content.attachement.name}</MyText> : <MyText>{content.attachement.name}</MyText> ): <View style={{flex:1, alignItems:"center", alignContent:"center",}}><ActivityIndicator style={{alignSelf:"center", marginTop:"75%"}} size="large" color="#0000ff" /></View> }
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