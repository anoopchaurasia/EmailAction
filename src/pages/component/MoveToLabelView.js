import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, Button, Modal, StyleSheet } from 'react-native';
import LabelService from '../../realm/LabelService';
import DataSync from './../../data/DataSync'

const SearchName = ({ setSelectedLabel, selectedLabel={} }) => {
  // State variables
  const [labels, setLabels] = useState([]);
  const [searchText, setSearchText] = useState(selectedLabel.name||"");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(x => {
    let list = LabelService.readAll();
    list = [...list];
    setLabels(list);
    console.log(list.length, "label data")
  }, []);

  async function setSelected(label) {
    if (label.id) {
      setModalVisible(false);
      return setSelectedLabel(label);
    }
    let newLabel = await DataSync.createLabel(label.name).then(async x => await x.json());
    newLabel.type = "user";
    await LabelService.create(newLabel);
    setLabels(l => {
      return [...l, newLabel];
    });
    setSelectedLabel(newLabel);
  }

  // Filter function
  const filterlabels = (text) => {
    return labels.filter(({ name }) => name=="inputbox" || name.toLowerCase().includes(text.toLowerCase()));
  };

  // Render item function
  const RenderItem = ({ item }) => {

    return (
      <Text
        style={{ padding: 10 }}
        onPress={() => setSelected(item)}>
        {item.name}
      </Text>
    );
  };

  // Create new name function
  const createNewName = () => {
    if (searchText.trim().length > 2) {
      setSelected({ name: searchText });
      setSearchText('');
    }
  };

  return (
    <View>
      <Text onPress={x=> setModalVisible(true)}> {selectedLabel.name||"Select Label"} </Text>
      <View style={{ padding:20}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={{...styles.centeredView, marginTop: 130}}>
            <View style={styles.modalView}>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.input}
                  placeholder="Search Label"
                  value={searchText}
                  onChangeText={setSearchText}
                  />

              </View>
              <View style={styles.listView}>
                <FlatList
                  data={filterlabels(searchText)}
                  renderItem={({item})=> <RenderItem item={item}/>}
                  keyExtractor={(item) => item.id}
                  />
              </View>
              <View style={{...styles.inputView, ...styles.buttonView}}>
                  {searchText.length>2 && <Button style={styles.createLabelButton} visible={false} title="Create New Label" onPress={createNewName} /> }
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    shadowColor: '#000',
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
  createLabelButton : {
    alignSelf:"stretch",
    width: "100%",
  },
  input: {
    height: 40,
    width: "100%",
    padding: 10,
    borderWidth: .2,
    borderColor: "#ccc",
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
    backgroundColor: 'white',
    borderRadius: 5,
    minWidth: 200,
    alignItems: "flex-start",
    shadowColor: '#000',
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

export default SearchName;