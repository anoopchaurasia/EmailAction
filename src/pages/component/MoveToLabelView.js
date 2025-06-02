import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, Button, Modal, StyleSheet } from 'react-native';
import LabelService from '../../realm/LabelService';
import DataSync from './../../data/DataSync'
import MyText from './../component/MyText'
import { useTheme } from '@react-navigation/native';

const SearchName = ({ setSelectedLabel, selectedLabelId }) => {
  let colors = useTheme().colors;
  // State variables
  const [labels, setLabels] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLabelLocal, setSelectedLabelLocal] = useState({});

  useEffect(x => {
    LabelService.readAll().then(x => {
      let list = [...x];
      setLabels(list);
      if (selectedLabelId) {
        setSelectedLabelLocal(list.filter(x => x.id === selectedLabelId)[0])
      }
      console.log(list.length, "label data")
    });

  }, []);

  async function setSelected(label) {
    if (label.id) {
      setModalVisible(false);
      setSelectedLabelLocal(label);
      return setSelectedLabel(label);
    }
    let newLabel = await DataSync.createLabel(label.name).then(async x => await x.json());
    newLabel.type = "user";
    await LabelService.create(newLabel);
    setModalVisible(false);
    setLabels(l => {
      return [...l, newLabel];
    });
    setSelectedLabel(newLabel);
    setSelectedLabelLocal(newLabel)
  }

  // Filter function
  const filterlabels = (text) => {
    return labels.filter(({ name }) => name == "inputbox" || name.toLowerCase().includes(text.toLowerCase()));
  };

  // Render item function
  const RenderItem = ({ item }) => {

    return (
      <MyText
        style={{ padding: 10 }}
        onPress={() => setSelected(item)}>
        {item.name}
      </MyText>
    );
  };

  // Create new name function
  const createNewName = () => {
    if (searchText.trim().length > 2) {
      setSelected({ name: searchText });
      setSearchText('');
    }
  };


  const styles = StyleSheet.create({
    inputView: {
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      alignSelf: "stretch"
    },
    buttonView: {
      marginBottom: -10

    },
    createLabelButton: {
      alignSelf: "stretch",
      width: "100%",
    },
    input: {
      height: 40,
      width: "100%",
      padding: 10,
      borderWidth: .2,
      borderBottomWidth: .2
    },
    centeredView: {
      alignItems: 'center',
    },
    listView: {
      flex: 1,
    },
    modalView: {
      flexDirection: 'column',
      backgroundColor: colors.background,
      borderRadius: 5,
      minWidth: 200,
      alignItems: "flex-start",
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      paddingBottom: 10
    }
  });

  return (
    <View style={{ borderColor: colors.border, borderWidth: .5, margin: 10, marginLeft: 0 }}>
      <MyText style={{ padding: 10 }} onPress={x => setModalVisible(true)}> {selectedLabelLocal.name || "Select Label"} </MyText>
      <View style={{}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={{ ...styles.centeredView, marginTop: 130 }}>
            <View style={styles.modalView}>
              <View style={styles.inputView}>
                <TextInput
                  style={{ ...styles.input, borderColor: colors.border }}
                  placeholder="Search Label"
                  value={searchText}
                  onChangeText={setSearchText}
                />

              </View>
              <View style={styles.listView}>
                <FlatList
                  data={filterlabels(searchText)}
                  renderItem={({ item }) => <RenderItem item={item} />}
                  keyExtractor={(item) => item.id}
                />
              </View>
              <View style={{ ...styles.inputView, ...styles.buttonView }}>
                {searchText.length > 2 && <Button style={styles.createLabelButton} visible={false} title="Create New Label" onPress={createNewName} />}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};


export default SearchName;