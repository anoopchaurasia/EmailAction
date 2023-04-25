import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Button } from 'react-native';
import MessageService from "../../realm/EmailMessage";
import MessageAggregateService from "../../realm/EmailAggregate";
import { TextInput, Checkbox } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ChangeLabel from '../../google/changeLabel';
import Label from '../../realm/Label'
import BottomBar from './bottombar'
import ActivityModel from '../../realm/Activity';

export default ListView = ({navigation}) => {
    let [list, setList] = useState([]);
    let [total, setTotal] = useState(0);
    let [selected, setSelected] = useState({});
    useEffect(x => {

        let list = MessageAggregateService.readMessage().slice(0, 20);
        let total = list.map(x => x.count).reduce((a, b) => a * 1 + b * 1, 0);
        setTotal(total);
        setList(list);
    }, []);


    async function moveToTrash() {
        console.log('moving to trash', Object.values(selected).map(x => x.sender));
        
        let data = await MessageService.fetchMessageIdBySenders(Object.values(selected).map(x => x.sender));
        data = data.filter(({ labels }) => labels.includes("TRASH") == false);
        let result = await ChangeLabel.trash(data, function (result) {
            console.log(result.length, "result");
            (result || []).forEach(x => MessageService.update(x));
            ActivityModel.createObject({
                message_ids: '',
                to_label: 'trash',
                is_reverted: false,
                has_rule: false
            })
        });
    }

    async function aggregate() {
        console.log("aggregation started")
        let senders = MessageService.getCountBySender();
        MessageAggregateService.deleteAll()
        senders = senders.map(sender => {
            let labels = [];
            for (let k in sender.labels) {
                labels.push({
                    count: sender.labels[k],
                    id: k,
                    name: k
                })
            }
            return {
                ...sender,
                labels: labels
            }
        });
        console.log("data ready", senders.length);
        senders.forEach(x => MessageAggregateService.create(x));
        console.log("completed");
    }


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
                    <Text onPress={x =>navigation.navigate("EmailListView", {sender: item.sender}) } style={{ flex: 1 }}>{item.sender} </Text>

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


    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            {/* <Text>{total}  {list.length}</Text> */}
            {/* <Button label="Trash" title="Trash" onPress={x => moveToTrash()}></Button>
            <Button label="Aggregate" title="Aggregate" onPress={x => aggregate()}></Button> */}
            <FlatList
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

            />
            <BottomBar
                onDelete={x => console.log("onDelete")}
                onMove={x => console.log('onMove')}
                onTrash={x => moveToTrash()} />
        </View>
    )

}

