import { useState, useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import MoveToLabelView from './MoveToLabelView'
import ActivityService from './../../realm/ActivityService'
import { Button } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MessageEvent from "../../event/MessageEvent";
import MyText from './../component/MyText';
import { useTheme } from '@react-navigation/native';


export default CreateRuleView = ({ route, navigation }) => {
    let [activity, setActivity] = useState({ ...{from_label:"INBOX",action: "move", title: `All emails from ${route.params.activity.from.join(", ").slice(0, 70)}`}, ...route.params.activity}); //
    let colors = useTheme().colors;
    function saveRule(activity) {
        try {
            if(activity.id) {
                ActivityService.updateObjectById(activity.id, activity);
                MessageEvent.emit("updated_new_rule", activity);
            } else {
                ActivityService.createObject(activity);
                MessageEvent.emit("created_new_rule", activity);
            }
            navigation.goBack();
        } catch(e) {
            console.error(e);
        }
    }

    async function updateActivity(data) {
        setActivity(act=> ({...act, ...data}))
    }
    

    async function setSelectedLabel(label) {
        updateActivity({to_label: label.id});
        console.log('selected label', label);
    }
    console.log(activity);
    return (
        <View style={{padding: 10}}>
            <View style={{flexDirection:"row", fontSize: 20, borderBottomWidth: 1, marginBottom: 5, paddingBottom: 5, borderColor:colors.border}}>
                <Icon name="subtitles-outline" size={25} style={{height: 40, paddingTop:10, paddingRight: 30, paddingLeft: 20}} />
                <TextInput onChangeText={text=>updateActivity({title: text}) } style={{borderColor:colors.border, borderWidth:.5, borderRadius: 5, flex:1, paddingLeft:10}} value={activity.title}/>
            </View>
            <View style={{flexDirection:"row", fontSize: 20, borderBottomWidth: 1, marginBottom: 5, paddingBottom: 5, borderColor:colors.border}}>
                <Icon name="checkbox-outline" size={25} style={{height: 40, paddingTop:10, paddingRight: 30, paddingLeft: 20}} />
                <View style={{flexDirection:"column", flex:1, height:70}}>
                    <MyText style={{marginBottom:10}}>From</MyText>
                    <TextInput onChangeText={text=> updateActivity({from: text.split(";").map(x=>x.trim())})} style={{borderColor:colors.border, borderWidth:.5, paddingLeft:10, borderRadius: 5, flex:1}} value={activity.from.join("; ")}/>
                </View>
            </View>
            <View style={{flexDirection:"row", fontSize: 20, borderBottomWidth: 1, marginBottom: 5, paddingBottom: 5, borderColor:colors.border}}>
                <Icon name="folder-move-outline" size={25} style={{height: 40, paddingTop:10, paddingRight: 30, paddingLeft: 20}} />
                <View style={{flexDirection:"column", flex:1, height:100}}>
                    <MyText> {activity.action=="copy"? 'Copy': "Move"} to</MyText>
                    <MoveToLabelView   selectedLabelId={activity.to_label} setSelectedLabel={setSelectedLabel} />
                </View>
            </View>
            <View style={{alignItems:"center", marginTop: 40}}>
            <Button mode="contained" onPress={() => saveRule(activity)}>
                Save Rule
            </Button>
            </View>
        </View>
    )
};