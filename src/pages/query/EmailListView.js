import React, { useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet, Dimensions, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import MessageService from "../../realm/EmailMessageService";
import QueryService from '../../realm/QueryMessageService';

import DataSync from '../../data/DataSync';
import EmailAttachmentView from "./EmailAttachmentView";

/*
 - get the messageid for the query: Done
 - update message that it contains attachment - 
 - 
*/

const formatDate = (date) => {
    
    return date.toDateString();
};

export default AttachementView = ({ navigation, route }) => {
    const PAGE_SIZE = 20;
    console.log(route.params.query.message_ids.length, "route.params.query.message_ids.length");
    let [list, setList] = useState([]);
    let [page, setPage] = useState(0);
    let [query, setQuery] = useState(route.params.query);
    let [openSearch, setOpenSearch] = useState(false);
    let [loading, setLoading] = useState(0);
    let [selectedEmail, setSelectedEamil] = useState(null);
    useEffect(x => {
        if(query.message_ids.length == 0) {
            loaddata("sfdfdfdfddddd");
        } else {
            loadLatestData()
        }

        return x => { };
    }, [query.query]);

    function loadLatestData() {

    }


    async function loaddata(sfdfdfdfdddd) {
        console.log("Load Data from sdfdfd "+ sfdfdfdfdddd)
        if((query.nextPageToken==null && query.message_ids.length>0) || query.completed) return console.log("All files already loaded")
        try {
            setLoading(true)
            if (query && query.query) {
                //TODO: hanlde own loop for data fetch
                let { message_ids, nextPageToken: pageToken } = await DataSync.fetchMessages(query.query, query.nextPageToken);
                console.log(message_ids, query.query);
                setQuery(z => {
                    z.message_ids.push(...message_ids);
                    let has = {};
                    z.message_ids = z.message_ids.filter(r => { return has[r] ? false : (has[r] = 1) })
                    z.nextPageToken = pageToken;
                    z.completed = pageToken==null
                    return z;
                });
                setList(message_ids.map(message_id => MessageService.getById(message_id)));
                message_ids.filter(mid=> MessageService.update({message_id:mid, has_attachement: true}));
               // await fetchBody(message_ids);

                QueryService.update(query);
                console.log(query.message_ids.length);
                setLoading(false);
                return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(x => {
        let messages = query.message_ids.map(message_id => MessageService.getById(message_id));
        console.log(query.message_ids.length, messages.length, "messages.length", messages[20]);
        setList(msgs => { msgs.push(...messages); return msgs });
    }, []);

    async function fetchBody(message) {
        if(!message) return console.log("no message");
        if(message.attachments && message.attachments.length>0)  {
            console.log("has attachement")
            setOpenSearch(true);
            return
        }
        console.log("fetch body", );
        let data = await DataSync.fetchData([message.message_id]);
        data.map(x => MessageService.update(x));
//        let messages = message_ids.map(message_id => MessageService.getById(message_id)).filter(x => x && x.attachments && (x.attachments.filter(r => r.name.match(/pdf$/i)).length));
        setList(msgs => { 
            msgs[selectedEmail] = data[0];
            return msgs 
        });
        setOpenSearch(true);
    }

    async function getNext() {
        ++selectedEmail;
        if (!list[selectedEmail]) {
            await loaddata("next");
            if(!list[selectedEmail]) {
                console.log("no message for index", selectedEmail);
                return list[--selectedEmail];
            }
        }
        await fetchBody(list[selectedEmail]);
        fetchBody(list[selectedEmail+1]);
        return list[selectedEmail];
    }

    async function getPrev() {
        --selectedEmail;
        if (!list[selectedEmail]) {
            return list[0];
        }
        await fetchBody(list[selectedEmail]);
        fetchBody(list[selectedEmail-1]);
        return list[selectedEmail];
    }

    const renderFooter = () => {

        if (loading) {
            return <ActivityIndicator size="large" color="#0000ff" />;
        }
        return null;
    };


    const handleEndReached = () => {
        loaddata("last page");
    };


    return (
        <View style={{ flex: 1, flexDirection: "column" }}>

            <FlatList
                data={list}
                style={{ flex: 1, marginBottom: 10 }}
                renderItem={({ item, index }) => <RenderItem
                    item={item} index={index} openModal={x => { setSelectedEamil(index); fetchBody(list[index]) }} />}
                keyExtractor={(item, i) => item.sender + i}
                contentContainerStyle={{ marginBottom: 50, margintop: 10 }}
                ListFooterComponent={renderFooter}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={openSearch}
                onRequestClose={() => {
                    setOpenSearch(false);
                }}
            >
                <EmailAttachmentView onClose={x => setOpenSearch(false)} password={query.pdf_password} selectedEmail={list[selectedEmail]} getNext={getNext} getPrev={getPrev} />
            </Modal>
        </View>
    )

}

const RenderItem = ({ item, openModal }) => {
    return (
        <TouchableOpacity onPress={openModal} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text>{item.sender_name}</Text>
            <Text style={{ fontWeight: 'bold' }}>{item.subject}</Text>
            <Text>{formatDate(item.date)}</Text>
            <Text>{item.labels.join(', ')}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});
