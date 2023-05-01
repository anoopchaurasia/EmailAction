import { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import DataSync from './../../data/DataSync'
import ActivityProcess from './../../data/ActivityProcess'
import * as Progress from 'react-native-progress';
import MessageService from "../../realm/EmailMessageService";
import Utility from "../../utility/Utility";
import ActivityService from '../../realm/ActivityService'

export default function Home(){
    let [inboxInfo, setInboxInfo]= useState({});
    let [count, setCount] = useState(MessageService.readAll().length||0);
    let [totalActivity, setTotalActivity] = useState({total:0,pending:0});
    let [prgressPer, setProgressPer] = useState(0);
    let [fetchCompleted, setFetchCompleted] = useState(false);
    let [fetchCompleted1, setFetchCompleted1] = useState(false);
    
    useEffect(x=>{
            DataSync.getTotalEmails().then(data=> {
                console.log(data);
                setInboxInfo(data);
                count && data.messagesTotal && setProgressPer(count/data.messagesTotal);
                let fetchedCount = count;
                ActivityProcess.proessremaining( (c, cc) => {
                    setCount(t => t + c);
                    fetchedCount += c;
                    console.log(fetchedCount, data.messagesTotal, "data.messagesTotal");
                    setProgressPer(fetchedCount/data.messagesTotal);
                    
                });
            });

            DataSync.getLabels(true);
            
            setTotalActivity({total: ActivityService.getAll().length, pending: ActivityService.getNoCompleted().length})
    },[]);
    Utility.getData("sync_completed").then(data=> {
        if(data=='yes') setFetchCompleted(true);
    })

    Utility.getData('full_sync_token').then(data=>{
        if(data=='done') setFetchCompleted1(true);
    })

    function clean(){
        MessageService.deleteAll();
        Utility.deleteData('sync_completed');
        Utility.deleteData('full_sync_token');
    }
    console.log(prgressPer, "prgressPer", fetchCompleted, count);
    
    return (
        <View>
            <View>
                <Progress.Bar progress={prgressPer} width={400} height={20} />
                <View style={{width:"90%", borderColor:"#ddd", borderWidth:1, margin:10}}>
                    <Text style={{fontSize: 30, textAlign:"center"}}>
                    Total
                    </Text>
                    <Text style={{fontSize: 40, textAlign: "center"}}>
                        {count}/{inboxInfo.messagesTotal}
                    </Text>
                    <Text>Fetch: {fetchCompleted? "Completed": "InProgress"} {fetchCompleted1?"done":"in prgress" }</Text>
                </View>
            </View>
            <View>
                <View style={{width:"90%", borderColor:"#ddd", borderWidth:1, margin:10}}>
                    <Text style={{fontSize: 30, textAlign:"center"}}>
                    Total Tasks
                    </Text>
                    <Text style={{fontSize: 40, textAlign: "center"}}>
                        {totalActivity.pending}/{totalActivity.total}
                    </Text>
                </View>
            </View>
            <Button title="clean" onPress={clean} />
        </View>
    )
}