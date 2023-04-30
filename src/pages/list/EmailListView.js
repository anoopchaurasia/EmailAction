import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import BottomBar from './bottombar';

import MessageService from '../../realm/EmailMessage';

// Assuming Attachment is a custom component that renders an attachment
//import Attachment from './Attachment';

// A function that formats a date to a readable string
const formatDate = (date) => {
    // Implement your own logic here
    return date.toDateString();
};



// A function that renders a single email item
const renderItem = ({ item }) => {
    return (
        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text style={{ fontWeight: 'bold' }}>{item.subject}</Text>
            <Text>{item.sender} ({item.sender_domain})</Text>
            <Text>{formatDate(item.date)}</Text>
            <Text>{item.labels.join(', ')}</Text>
            {/* {item.attachments.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {item.attachments.map((attachment) => (
            <Attachment key={attachment.id} attachment={attachment} />
          ))}
        </View>
      )} */}
        </View>
    );
};



// The main component that takes an array of email data as a prop
const EmailList = ({ route, navigation }) => {
    console.log(route,"route");
    const [page, setPage] = useState(1);
    let [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    function moveToTrash() {
        route.params.onGoback({action: "trash", sender: route.params.sender});
        navigation.goBack()
    }

    function gotoPrev() {
        navigation.goBack()
        route.params.onGoback({action: "prev", sender: route.params.sender});
    }

    function goToNext() {
        navigation.goBack()
        route.params.onGoback({action: "next", sender: route.params.sender});
    }

    useEffect(x => {
        // Set the loading status to true
        setLoading(true);
        let ll = MessageService.getBySender(route.params.sender, page, 10);
        setList(l => { l.push(...ll); return l; });
        console.log(page, list.length);
        setLoading(false);
    }, [page]);

    const renderFooter = () => {
        // If loading, return an ActivityIndicator
        if (loading) {
            return <ActivityIndicator size="large" color="#0000ff" />;
        }
        // Otherwise, return null
        return null;
    };

    // A function that handles the end reached event of the FlatList
    const handleEndReached = () => {
        // Increment the page number by one
        setPage((prevPage) => prevPage + 1);
    };
    return (
        <>
        <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={(item) => item.message_id}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
        />
        <BottomBar
            onTrash={x => moveToTrash()}
            onDelete={x=> gotoPrev()} 
            onMove={x=> goToNext()} 
        />
        </>
    );
};

export default EmailList;