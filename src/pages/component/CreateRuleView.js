import React, { useState } from "react";
import { Text, TextInput, View, ScrollView, StyleSheet } from "react-native";
import MoveToLabelView from './MoveToLabelView';
import ActivityService from './../../realm/ActivityService';
import { Button } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MessageEvent from "../../event/MessageEvent";
import MyText from './../component/MyText';
import { useTheme } from '@react-navigation/native';

export default CreateRuleView = ({ route, navigation }) => {
  const { colors } = useTheme();

  const [activity, setActivity] = useState({
    from_label: "INBOX",
    action: "move",
    title: `All emails from ${route.params.activity.from.join(", ").slice(0, 70)}`,
    ...route.params.activity
  });

  const updateActivity = (data) => {
    setActivity((prev) => ({ ...prev, ...data }));
  };

  const saveRule = () => {
    try {
      if (activity.id) {
        ActivityService.updateObjectById(activity.id, activity);
      } else {
        ActivityService.createObject(activity);
      }
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  };

  const setSelectedLabel = (label) => {
    updateActivity({ to_label: label.id });
    console.log('selected label', label);
  };

  const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    section: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderColor: colors.border,
      paddingBottom: 10,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      marginRight: 16,
      marginLeft: 4,
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 10,
      color: colors.text,
      backgroundColor: colors.card,
    },
    labelContainer: {
      marginTop: 10,
    },
    fromInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 8,
      marginBottom: 8,
      backgroundColor: colors.card,
      color: colors.text,
    },
    buttonContainer: {
      alignItems: "center",
      marginTop: 40,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Title Section */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Icon name="subtitles-outline" size={24} style={styles.icon} color={colors.text} />
          <TextInput
            placeholder="Rule Title"
            style={styles.textInput}
            value={activity.title}
            onChangeText={(text) => updateActivity({ title: text })}
            placeholderTextColor={colors.text + '66'}
          />
        </View>
      </View>

      {/* From Email Section */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Icon name="checkbox-outline" size={24} style={styles.icon} color={colors.text} />
          <MyText>From</MyText>
        </View>
        <View style={styles.labelContainer}>
          {activity.from.map((item, index) => (
            <TextInput
              key={index}
              style={styles.fromInput}
              value={item}
              editable={false}
            />
          ))}
        </View>
      </View>

      {/* Action Section */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Icon name="folder-move-outline" size={24} style={styles.icon} color={colors.text} />
          <MyText>{activity.action === "copy" ? "Copy to" : "Move to"}</MyText>
        </View>
        <View style={styles.labelContainer}>
          <MoveToLabelView
            selectedLabelId={activity.to_label}
            setSelectedLabel={setSelectedLabel}
          />
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={saveRule}>
          Save Rule
        </Button>
      </View>
    </ScrollView>
  );
};
