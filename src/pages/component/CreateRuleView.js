import { useState, useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import {Picker} from '@react-native-picker/picker';
import LabelService from './../../realm/LabelService'
import MoveToLabelView from './MoveToLabelView'



export default CreateRuleView = ({ route, navigation }) => {

    let [from, setFrom] = useState(route.params.senders.join(", "));
    let [moveTo, setMoveTo] = useState({});
    const [labels, setLabels] = useState([]);

    useEffect(x=>{
        let list = LabelService.readAll();
        setLabels(list);
      }, []);

      async function setSelectedLabel(label) {
        setMoveTo(label);
        console.log('selected label', label);
    }

    return (
        <View>
            <View>
                <Text>Title</Text>
                <TextInput value={`trash all email from ${route.params.senders.join(", ")}`}/>
            </View>
            <Text>Filters</Text>
            <View>
                <Text>Sender</Text>
                <TextInput onChangeText={text=> setFrom(text)} value={from}/>
            </View>
            <Text>Action</Text>
            <View>
                <Text>Move To</Text> 
                <MoveToLabelView selectedLabel={moveTo} setSelectedLabel={setSelectedLabel} />
            </View>
            <View>
                <Text>Delay</Text> 
                
            </View>
        </View>
    )
};