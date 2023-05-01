import React, {useEffect, useState} from 'react';
import {View, TextInput, FlatList, Text, Button} from 'react-native';
import LabelService from '../../realm/LabelService';
import DataSync from './../../data/DataSync'

const SearchName = ({setSelectedLabel, onClose}) => {
  // State variables
  const [labels, setLabels] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(x=>{
    let list = LabelService.readAll();
    setLabels(list);
  }, []);

  async function setSelected(label) {
      if(label.id) return setSelectedLabel(label);
      onClose();
    let newLabel = await DataSync.createLabel(label.name).then(async x=>await x.json());
    newLabel.type="user";
    await LabelService.create(newLabel);
    setLabels(l=> {
        l.push(newLabel);
        return l;
    });
    setSelectedLabel(newLabel);
  }

  // Filter function
  const filterlabels = (text) => {
    return labels.filter(({name}) => name.toLowerCase().includes(text.toLowerCase()));
  };

  // Render item function
  const renderItem = ({item}) => {
    return (
      <Text
        style={{padding: 10}}
        onPress={() => setSelected(item)}>
        {item.name}
      </Text>
    );
  };

  // Create new name function
  const createNewName = () => {
    if (searchText.trim().length>2) {
      setSelected({name: searchText});
      setSearchText('');
    }
  };

  return (
    <View style={{flex: 1}}>
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        placeholder="Search name"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filterlabels(searchText)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Button title="Create new Label" onPress={createNewName} />
    </View>
  );
};

export default SearchName;