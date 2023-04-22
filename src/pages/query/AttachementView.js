import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Modal, Button} from 'react-native';
import MessageAggregateService from "../../realm/EmailAggregate";
import { Checkbox } from 'react-native-paper';
import QueryView from './QueryView';
import DataSync from './../../data/DataSync';
import PDFView from 'react-native-pdf';
import Login from './../../google/login';
const resources = {
    url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/187a4cdc62eedb03/attachments/'ANGjdJ8h391_o-YLsCEFd1db2VgfCIyC9Dz0OYkNmUt8ineqwoEjiYvWvwCnhlgS02DxyPU43_51sisimdAbO0qESQaxhMOYlb2iUsyGLJsVwaWkQgza8wfUzO45M0TJ9gVo4uPYBZd6FQpt8tLwRSXcfunJ16V85SNMEaDL9eMwr2HPN7ELk6c4QNmJzCh6Itgjvc9H8eDfugbGDRbjuCLt9pSA3YnDtZJG8iesC7SuSB8KZEoGJDKC37FqmztJTdMPOKHtioRjGUWXC9MK888Y0_wmvZ1Q3ml6eN2l5gSrORKRCw3QbRcad06E0yi8fK9UapgKQ3kZFxwBj9fWrbrvlj3rnl698xIXbbKpX9wDlHThKVKosw9lXbwtWmIQbN5GLLZmJjnABODNQgkJ`,
  };
  

export default AttachementView = ({navigation}) => {
    let [list, setList] = useState([]);
    let [openSearch, setOpenSearch] = useState(false);
    let [query, setQuery] = useState('');
    let [PDFContent, setPDFContent] = useState(''); 
    const resourceType = 'url';
    useEffect( x => {

        async function run() {
            let nextPageToken;
            if(query) {
                return setPDFContent(await DataSync.loadAttachment("187a4cdc62eedb03", "ANGjdJ91S2yjsBAAO6LU6b3LMa_r8Am_JuMXgLOp-b3h4QnBlAMM5_dQBqygSFk2tWw7W5aHESYkiV3iOvbbXIMX4wco_pozfN_HNZPIosq77zUDWJo1C6ZwZgaiXYF9wW96dqk3cb7x4WvuMflyJAqE8yNvRM9Ef0InswdWKvvPu6t8rvaBTJlhwcAHgFF9H8ClYfW0PESWWwMW65RNh4Q9gqoqho-lj8hJdhR4LpALYJd-hEacSy7WdT0PoAFks2_2bvZckPznDEvCTbQ2f7BWyQRoXtrUU99rapogUwlpxM6pW8bkrLXYK2sSNCRbCY7Lf6MfjafSxcMIruJtaCnTUe9NfQFCfWxLUCICzkDjmT0vYRX1WIz0Ansq4p1D2rEE3aEJ3Tk994sqhs5K"));
                do {
                    console.log(nextPageToken, "nextPageToken Attachment")
                    let {message_ids, nextPageToken: pageToken} =  await DataSync.getList(query);
                    nextPageToken = pageToken;
                    let data =  await DataSync.fetchData(message_ids);

                    console.log("----------------------------------------------------------------------------------------", data, "----------------------------------------------------------------------------------------");
                    return;
                } while(nextPageToken)
            }
        };
        run();
        return x=> {};
    }, [query]);

  
    function RenderItem({ item, checked, onPress }) {
        let [s, setS] = useState(checked || false);
        return (

            <View style={{ flexDirection: "row", borderBottomWidth: .2, borderBottomColor: "#eee", margin: 5, margintop: 10 }}>
                <Checkbox
                    status={s
                        ? 'checked' : 'unchecked'}
                    onPress={x => {
                        setS(r => !r);
                        onPress(s);
                    }

                    }
                />
                <View style={{ flexDirection: "column", flex: 1 }}>
                    <Text onPress={x =>navigation.navigate("Details", {sender: item.sender}) } style={{ flex: 1 }}>{item.sender} </Text>

                    {/* <Text style={{ fontSize: 9 }}>
                    {item.labels.map(x => x.id).map(id => <Text style={{ borderColor: "#ccc", backgroundColor: "#ccc", margin: 10 }} key={id}>{Label.getById(id).name} </Text>)}
                </Text> */}
                </View>
                <Text>
                    {item.count}
                </Text>

            </View>
        )
    }

    console.log(PDFContent && PDFContent.length);
    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <Login />
            <View style={{height:40, }}>
                <Button style={{height: 40}} height={40} title="Search" onPress={x=> setOpenSearch(true)} />
            </View>
           {PDFContent ? <PDFView
          fadeInDuration={250.0}
            style={{ flex: 1 }}
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
            {/* <FlatList
                data={list}
                style={{ flex: 1, marginBottom: 10 }}
                renderItem={({ item }) => <RenderItem
                    checked={!!selected[item.sender]}
                    onPress={checked =>
                        setSelected(r => {
                            if (checked) {
                                delete selected[item.sender]
                            } else {
                                selected[item.sender] = item
                            }
                            return selected;
                        })
                    }
                    item={item} />}
                keyExtractor={(item) => item.sender}
                contentContainerStyle={{ marginBottom: 50, margintop: 10 }}

            /> */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={openSearch}
                onRequestClose={(query) => {
                    setOpenSearch(false);
                }}
            >
                <QueryView onClose={query=> {
                    console.log('Query', query);
                    setQuery(query);
                    setOpenSearch(false);
                }} />
            </Modal>
        
        </View>
    )

}

