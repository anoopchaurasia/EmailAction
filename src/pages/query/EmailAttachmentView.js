import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator, ScrollView, Image } from 'react-native';
import BottomBar from './../component/BottomBarView';
import DataSync from '../../data/DataSync';
import PDFView from 'react-native-pdf';
import MyText from './../component/MyText';
import EmailMessageService from './../../realm/EmailMessageService';
import { useTheme } from '@react-navigation/native';


export default AttachementView = ({ selectedEmail, password, getNext, getPrev, onClose }) => {
    const colors = useTheme().colors;
    let [selected, setSelected] = useState(selectedEmail);
    let [selectedFile, setSelectedFile] = useState(selectedEmail.attachments[0]);
    let [loadAttachmentData, setLoadAttachmentData] = useState(null);
    let [inProgress, setInprogress] = useState(false);
    let actionList = [{
        name: "Prev",
        icon: "page-previous-outline",
        action: x => goToPrev()
    }, {
        name: "Next",
        icon: "page-next-outline",
        action: x => goToNext()
    }];

    function getType(filename) {

        if (filename.match(/\.pdf$/igm)) return 'pdf'
        if (filename.match(/\.(png|jpeg|jpg)$/igm)) return 'image'
        return 'others'
    }

    useEffect(x => {
        (async function a(){
            if(selectedFile.data) return setLoadAttachmentData({type: selectedFile.type, data: selectedFile.data});
            let type = getType(selectedFile.name);
            let data;
            if(type == 'pdf' || type == 'image') {
                data = await DataSync.loadAttachment(selected.message_id, selectedFile.id);
                EmailMessageService.updateAttachmentById({id:selectedFile.id, type, data});
            }
            setLoadAttachmentData({type, data});
        }) ()

    }, [selectedFile]);
    
    useEffect(x=>{
        setSelectedFile(selected.attachments[0])
    }, [selected])
    
    async function goToNext() {
        if(inProgress) return console.log("loading data for prev email");
        setInprogress(true);
        setLoadAttachmentData(null);
        setSelected(await getNext());
        setInprogress(false);
    }
    
    async function goToPrev() {
        if(inProgress) return console.log("loading data for prev email");
        setInprogress(true);
        setLoadAttachmentData(null)
        setSelected(await getPrev());
        setInprogress(false);
    }
    
    return (
        <View style={{ flex: 1, flexDirection: "column", backgroundColor:"red", backgroundColor: colors.background }}>
            <View style={{ ...styles.container, borderColor: colors.border }}>
                <MyText style={{ }}>{selected.sender_name}</MyText>
                <MyText style={{ fontWeight: 'bold' }}>{selected.subject}</MyText>
                <MyText >{(selected.date.toString())}</MyText>
            </View>
            {loadAttachmentData && loadAttachmentData.data ? 
            
            (  loadAttachmentData.type === 'pdf' ? <PDFView
                fadeInDuration={250.0}
                style={styles.pdf}
                password={password}
                source={{ uri: `data:application/pdf;base64,${loadAttachmentData.data}` }}
                onLoadComplete={(numberOfPages) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}

            /> 
            : loadAttachmentData.type === 'image' ? <View  style={styles.pdf}><Image
            resizeMode="contain"
                style={{width:"100%",height:"100%"}}
                    source={{
                    uri: `data:image/png;base64,${loadAttachmentData.data}`,
                    }}
                /></View>
            : <MyText>{selectedFile.name}</MyText>)  
            
            : <View style={{ flex: 1, alignItems: "center", alignContent: "center", }}><ActivityIndicator style={{ alignSelf: "center", marginTop: "75%" }} size="large" color="#0000ff" /></View>}
            <View>

                <ScrollView
                    horizontal
                    contentContainerStyle={styles.scrollView}
                    showsHorizontalScrollIndicator={false}
                >
                    {selected.attachments.map((x, i) => <MyText onPress={()=> {setLoadAttachmentData(null); setSelectedFile(x)} } key={i} style={{...styles.label, backgroundColor: x.id==selectedFile.id? "rgba(39, 39, 41, 1)":"rgba(39, 39, 41, .5)"}}> {x.name}</MyText>)}
                </ScrollView>
            </View>
            <BottomBar visible={true} disabled={inProgress} style={{ backgroundColor: "#ccc" }} list={actionList} />

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        padding: 10, 
        borderBottomWidth: 1, 
        borderColor: "rgb(39, 39, 41)", 
        height: 75
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    label: {
        fontSize: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 3,
        paddingHorizontal: 10,
        lineHeight: 20,
        height: 25,
        marginRight: 3,
        borderRadius: 5,
    },
    scrollView: {
        flexDirection: 'row',
        height: 35,
        alignItems:"flex-start",
        padding: 5,
        margin: 0
      },
});