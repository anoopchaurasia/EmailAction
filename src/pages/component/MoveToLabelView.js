import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Button,
  Modal,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LabelService from '../../realm/LabelService';
import DataSync from './../../data/DataSync';
import MyText from './../component/MyText';
import { useTheme } from '@react-navigation/native';

const SearchName = ({ setSelectedLabel, selectedLabelId }) => {
  const colors = useTheme().colors;
  const inputRef = useRef(null);

  const [labels, setLabels] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLabelLocal, setSelectedLabelLocal] = useState({});

  useEffect(() => {
    LabelService.readAll().then((x) => {
      let list = [...x];
      setLabels(list);
      if (selectedLabelId) {
        const found = list.find((x) => x.id === selectedLabelId);
        if (found) setSelectedLabelLocal(found);
      }
    });
  }, []);

  useEffect(() => {
    if (modalVisible && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [modalVisible]);

  const handleSelectLabel = async (label) => {
    if (label.id) {
      setModalVisible(false);
      setSelectedLabelLocal(label);
      return setSelectedLabel(label);
    }
    const newLabel = await DataSync.createLabel(label.name).then((x) => x.json());
    newLabel.type = 'user';
    await LabelService.create(newLabel);
    setLabels((prev) => [...prev, newLabel]);
    setModalVisible(false);
    setSelectedLabel(newLabel);
    setSelectedLabelLocal(newLabel);
  };

  const filterLabels = (text) =>
    labels.filter(({ name }) =>
      name.toLowerCase().includes(text.toLowerCase())
    );

  const createNewLabel = () => {
    if (searchText.trim().length > 2) {
      handleSelectLabel({ name: searchText });
      setSearchText('');
    }
  };

  const RenderItem = ({ item }) => {
    const isSelected = selectedLabelLocal?.id === item.id;
    return (
      <Pressable
        onPress={() => handleSelectLabel(item)}
        style={[
          styles.itemContainer,
          isSelected && { backgroundColor: colors.primary + '22' },
        ]}
      >
        <MyText style={{ color: colors.text }}>{item.name}</MyText>
      </Pressable>
    );
  };

  const styles = StyleSheet.create({
    container: {
      borderColor: colors.border,
      borderWidth: 0.5,
      borderRadius: 10,
      marginHorizontal: 10,
      marginVertical: 5,
    },
    labelSelector: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.card,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#00000099',
    },
    modalView: {
      width: '85%',
      maxHeight: '80%',
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    input: {
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      color: colors.text,
    },
    itemContainer: {
      padding: 12,
      borderBottomWidth: 0.5,
      borderColor: colors.border,
    },
    createButtonContainer: {
      marginTop: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setModalVisible(true)} style={styles.labelSelector}>
        <MyText>{selectedLabelLocal.name || 'Select Label'}</MyText>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.centeredView}
        >
          <View style={styles.modalView}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Search or create label"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={colors.text + '88'}
            />

            <FlatList
              data={filterLabels(searchText)}
              renderItem={({ item }) => <RenderItem item={item} />}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
            />

            {searchText.length > 2 && (
              <View style={styles.createButtonContainer}>
                <Button title="Create New Label" onPress={createNewLabel} />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default SearchName;
