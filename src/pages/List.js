import React, { useEffect, useState } from "react";
import {FlatList, Text, View, Button} from 'react-native';
import MessageService from "../realm/EmailMeta";
import { TextInput, Checkbox } from 'react-native-paper';


export default ListView = () => {
    let [list, setList] = useState([]);
    let [total, setTotal] = useState(0);
    useEffect(x=>{

        let list = MessageService.getCountBySender();
        list = list.sort((a,b)=> b.v-a.v).slice(0, 3);
        let total = list.map(x=>x.v).reduce((a,b)=> a*1+b*1, 0);
        setTotal(total);
         setList(list)
    }, []);

    function RenderItem({item}) {
        let [s, setS] = useState(false);
        return (
            <View style={{flexDirection:"row"}}>
                <Checkbox
                  status={s
                    ? 'checked' : 'unchecked'}
                  onPress={x => setS(!s)}
                />
                 <Text style={{flex:4}}>{item.k} </Text><Text> {item.v}</Text>
            </View>
        )
    }

    function moveToTrash() {

    }
    

    function moveToFolder() {
        
    }

    return (
        <View>
            <Text>{total}  {list.length}</Text>
            <Button label="Trash" title="Trash" onPress={moveToTrash()}></Button>
            <FlatList
                data={list}
                renderItem={({item})=> <RenderItem item={item} />}
                keyExtractor={(item) => item.k}
            />
        </View>
    )

}

