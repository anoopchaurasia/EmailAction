import React, { useEffect, useState } from "react";
import { FlatList, Text, View,  StyleSheet, Dimensions, Modal} from 'react-native';
import MessageService from "../../realm/EmailMessageService";
import QueryService from '../../realm/QueryMessageService';

import DataSync from '../../data/DataSync';
import EmailAttachmentView from "./EmailAttachmentView";

export default AttachementView = ({navigation, route}) => {
    let [list, setList] = useState([]);
    let [query, setQuery] = useState(route.params.query);
    let [openSearch, setOpenSearch] = useState(false);
    let [currentIndex, setCurrentIndex] = useState(0);
    let [selectedEmail, setSelectedEamil] = useState(null);
    useEffect( x => {
        query.message_ids.length ==0&& loaddata();
        return x=> {};
    }, [query.query]);


    async function loaddata() {
        try{
        let nextPageToken;
        if(query && query.query) {
            do {
                console.log(nextPageToken, "nextPageToken Attachment")
                //TODO: hanlde own loop for data fetch
                let {message_ids, nextPageToken: pageToken} =  await DataSync.fetchMessages(query.query, query.nextPageToken);
                nextPageToken = pageToken;
                setQuery(z=> {
                    z.message_ids.push(...message_ids);
                    let has = {};
                    z.message_ids = z.message_ids.filter(r=> {return has[r]? false: (has[r]=1 )} )
                    z.nextPageToken = nextPageToken;
                    return z;
                });
                await fetchBody(message_ids);
                QueryService.update(query);                   
                return;
            } while(nextPageToken)
        }
    }catch(e) {
        console.error(e);
    }
    }

    useEffect(x=> {
        let messages =  query.message_ids.map(message_id=> MessageService.getById(message_id)).filter(x=>x && x.attachments && (x.attachments.filter(r=>r.name.match(/pdf$/i)).length) ) ;
        setList(msgs=> {msgs.push(...messages); return msgs});
        console.log(messages);
    }, []);

    async function fetchBody(message_ids) {
        console.log("data", message_ids);
        let data =  await DataSync.fetchData(message_ids);
        data.map(x=> MessageService.update(x));
        let messages =  message_ids.map(message_id=> MessageService.getById(message_id)).filter(x=>x && x.attachments && (x.attachments.filter(r=>r.name.match(/pdf$/i)).length) ) ;
        setList(msgs=> {msgs.push(...messages); return msgs});
    }

    function getNext() {
        ++selectedEmail;
        if(!list[selectedEmail]) {
            loaddata();
            return list[--selectedEmail];
        }
        return list[selectedEmail];
    }

    function getPrev(){
        --selectedEmail;
        if(!list[selectedEmail]) {
            return list[0];
        }
        return list[selectedEmail];   
    }

    console.log(list, "list");
    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            
            <FlatList
                data={list}
                style={{ flex: 1, marginBottom: 10 }}
                renderItem={({ item, index }) => <RenderItem
                    item={item} index={index} openModal={x=>{setSelectedEamil(index); setOpenSearch(true); }} />}
                keyExtractor={(item, i) => item.sender + i}
                contentContainerStyle={{ marginBottom: 50, margintop: 10 }}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={openSearch}
                onRequestClose={() => {
                    setOpenSearch(false);
                }}
            >
                <EmailAttachmentView onClose={x=> setOpenSearch(false)} password={query.pdf_password} selectedEmail={list[selectedEmail]} getNext={getNext} getPrev={getPrev}/>
            </Modal>
        </View>
    )

}

function RenderItem({ item, openModal, index }) {
    console.log(index, "index");
    return (

        <View style={{ flexDirection: "row", borderBottomWidth: .2, borderBottomColor: "#eee", margin: 5, margintop: 10 }}>
            <View  style={{ flexDirection: "column", flex: 1 }}>
                <Text onPress={openModal} style={{ flex: 1 }}>{item.sender}  </Text>
                <Text >{item.date.toISOString()}</Text>
            </View>
            <Text>
                {item.count}
            </Text>

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