import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import EmailMeta from '../../realm/EmailMessageService';


const SubjectView = ({route:{params}}) => {
  // Define the data for the flat list
  //console.log('params', props)
  let [emails, setEmails] = useState([]);
  useEffect(x=>{
    let emails = EmailMeta.getBySender(params.sender); 
    setEmails(emails);
  },[])
  // Define the function to render each item in the flat list
  const renderItem = ({ item }) => {
    return (
      <View style={{ padding: 10 }}>
        <Text>{item.subject}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 50, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>Filter View</Text>
      </View>
      <FlatList
        data={emails}
        renderItem={renderItem}
        keyExtractor={(item) => item.message_id}
      />
    </View>
  );
};

export default SubjectView;