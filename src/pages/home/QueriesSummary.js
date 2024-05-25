import { useEffect, useState } from "react";
import {Text, TouchableHighlight, View } from "react-native";
import QueryService from "../../realm/QueryMessageService";
import { useTheme } from '@react-navigation/native';
import MyText from './../component/MyText';


export default function QueriesSummary({navigation}) {
    const [count, setCount]=useState(-1);
    const colors = useTheme().colors;

    useEffect(x => {
      let count = QueryService.getAll().length;
      setCount(count);
    }, []);



    return (
        <TouchableHighlight underlayColor={colors.underlayColor} onPress={x=> navigation.navigate("QueryListView")}>
            <View style={{ width: "90%", borderColor: colors.border, borderWidth: 1, margin: 10, marginLeft:"5%" }}>
                    <MyText style={{ fontSize: 30, textAlign: "center", color: colors.text }}>
                        Total Queries
                    </MyText>
                    <MyText style={{ fontSize: 40, textAlign: "center", color: colors.text  }}>
                        {count}
                    </MyText>
                </View>
        </TouchableHighlight>

    );

}

