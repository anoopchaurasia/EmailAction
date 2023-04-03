import React, { useEffect, useState } from "react";
import {Text, View} from 'react-native';
import MessageService from "../realm/EmailMeta";


export default ListView = () => {
    let [list, setList] = useState([]);
    useEffect(x=>{

        let list = MessageService.getCountBySenderDomain();
        console.log(list);
        setList(list)
    }, []);

    return (
        <View>
            {list.map(x=> <Text key={x.k}>{x.k}:{x.v}</Text>)}
        </View>
    )
}