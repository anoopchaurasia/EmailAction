import React, { useEffect, useState } from "react";
import { Text, View, TouchableHighlight } from "react-native";

 import MessageService from "../../realm/EmailMessageService";
import Utility from "../../utility/Utility";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MyText from './../component/MyText'
import { useTheme } from '@react-navigation/native';

export default function EmailSummary({ navigation }) {

    let [count, setCount] = useState( 0);
 
    let colors = useTheme().colors;
    MessageService.getCount().then(count => {
        setCount(count);
    });
    let [fetchCompleted, setFetchCompleted] = useState(false);

    Utility.getData("sync_completed").then(data => {
        if (data == 'yes') setFetchCompleted(true);
    })


    return (
        <TouchableHighlight onPress={x => navigation.navigate("EmailListByEmail")}>
            <View>
                <View>
                    <View style={{ width: "90%", borderColor: colors.border, borderWidth: 1, margin: 10, marginLeft: "5%" }}>
                        <MyText style={{ fontSize: 30, textAlign: "center" }}>
                            Total Emails
                        </MyText>
                        <View style={{position:"absolute", right: 20}}>

                            {fetchCompleted?  
                                <Icon name="sync" size={25} style={{marginTop: 10, marginLeft: 0}} /> : 
                                <Icon name="progress-clock" size={25} style={{marginTop: 10, marginLeft: 0}} /> 
                            }
                        </View>
                        <MyText style={{ fontSize: 40, textAlign: "center" }}>
                            {count}
                        </MyText>
                        
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );

}

