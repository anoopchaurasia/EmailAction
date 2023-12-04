import React, { useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet, Dimensions, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import MessageService from "../../realm/EmailMessageService";
import QueryService from '../../realm/QueryMessageService';
import Activity from './../../data/ActivityProcess';
import DataSync from '../../data/DataSync';
import EmailAttachmentView from "./EmailAttachmentView";
import MyText from './../component/MyText';
import { useTheme } from '@react-navigation/native';

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
    let colors = useTheme().colors;
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
    }, []);

    async function loadLatestData() {
        console.log("fetching new messages")
        try {
            setLoading(true)
            if (query && query.query) {
                do {
                    ///get List porcess only newly added messages

                    var { message_ids, nextPageToken } = await DataSync.fetchMessages(QueryService.getQueryString(query.query), nextPageToken);
                    let length = message_ids.length;
                    message_ids = message_ids.filter(message_id => query.message_ids.includes(message_id) == false);
                    if (length !== message_ids.length) nextPageToken = undefined;
                    var messages = [];
                    let nonstored_message_ids = message_ids.filter(id=> MessageService.checkMessageId(id) == false)
                    if (nonstored_message_ids.length) {
                        messages = await DataSync.fetchMessageMeta(nonstored_message_ids);
                        await Activity.newMessages(messages);
                        messages.map(x => { try { MessageService.update(x) } catch (e) { console.error(e, "update failed getList", x) } });
                    }
                    message_ids.filter(mid=> MessageService.update({message_id:mid, has_attachement: true}));
                    setQuery(z => {
                        z.message_ids.unshift(...(message_ids));
                        return z;
                    });
                    QueryService.update(query);
                    setList(msgs=> {
                        msgs.push(...(message_ids.map(mid=> MessageService.getById(mid))));
                        msgs.sort((a,b)=> a.date>b.date?-1:1);
                        return msgs;
                    });
                    console.log("--------------fetching new messages", messages.length);
                } while (nextPageToken);
            }
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    }


    async function loaddata() {
        if((query.nextPageToken==null && query.message_ids.length>0) || query.completed) return console.log("All files already loaded")
        try {
            setLoading(true)
            if (query && query.query) {
                //TODO: hanlde own loop for data fetch
                let { message_ids, nextPageToken: pageToken } = await DataSync.fetchMessages(QueryService.getQueryString(query.query), query.nextPageToken);
                console.log(message_ids, query.query);
                setQuery(z => {
                    z.message_ids.push(...message_ids);
                    let has = {};
                    z.message_ids = z.message_ids.filter(r => { return has[r] ? false : (has[r] = 1) })
                    z.nextPageToken = pageToken;
                    z.completed = pageToken==null
                    return z;
                });
                setList(msg=> {
                    msgs.push(...(message_ids.map(message_id => MessageService.getById(message_id))))
                    msgs.sort((a,b)=> a.date>b.date?-1:1);
                    return msgs;
                });
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
        setList(msgs => { msgs.push(...messages); msgs.sort((a,b)=> a.date>b.date?-1:1); return msgs });
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
                colors={colors}
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

const RenderItem = ({ item, openModal, colors }) => {
    return (
        <TouchableOpacity onPress={openModal} style={{ padding: 10, borderBottomWidth: 1, borderColor: colors.border}}>
            <MyText>{item.sender_name}</MyText>
            <MyText style={{ fontWeight: 'bold' }}>{item.subject}</MyText>
            <MyText>{formatDate(item.date)}</MyText>
            <MyText>{item.labels.join(', ')}</MyText>
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
