import { useState, useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import {Picker} from '@react-native-picker/picker';
import LabelService from './../../realm/LabelService'



export default CreateRuleView = ({ route, navigation }) => {

    let [from, setFrom] = useState(route.params.senders.join(", "));
    let [moveTo, setMoveTo] = useState('Trash');
    const [labels, setLabels] = useState([]);


    useEffect(x=>{
        let list = LabelService.readAll();
        setLabels(list);
      }, []);

    return (
        <View>
            <View>
                <Text>Title</Text>
                <TextInput value={`trash all email from ${route.params.senders.join(", ")}`}/>
            </View>
            <View>
                <Text>From</Text>
                <TextInput onChangeText={text=> setFrom(text)} value={from}/>
            </View>
            <View>
                <Text>Move To</Text>
                <Picker
                    selectedValue={moveTo}
                    onValueChange={(itemValue, itemIndex) =>
                        setMoveTo(itemValue)
                    }
                    >
                    {labels.map((item, index) => (
                        <Picker.Item key={index} label={item.name} value={item.id} />
                    ))}
                    </Picker>
                

                
            </View>
        </View>
    )
};