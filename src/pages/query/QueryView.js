import React from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {DatePickerInput, registerTranslation, en, tr} from 'react-native-paper-dates';

registerTranslation('en', en);


const AdvancedFilter = ({onClose}) => {
  // Declare state variables for each input field
  const [inValue, setInValue] = React.useState('');
  const [fromValue, setFromValue] = React.useState('');
  const [toValue, setToValue] = React.useState('');
  const [subjectValue, setSubjectValue] = React.useState('');
  const [notHasValue, setNotHasValue] = React.useState('');
  const [bodyValue, setBodyValue] = React.useState('');
  const [hasAttachement, setHasAttachement] = React.useState(true);
  //const [largerValue, setLargerValue] = React.useState('');
  const [afterValue, setAfterValue] = React.useState('');
  const [beforeValue, setBeforeValue] = React.useState('');
  // Declare a function to handle the search button press

  function setValue(key, value, raw_value) {
    if(value==undefined || value=='') return "";
    if(raw_value) {
        return `${key}:${value}`
    }
    return `${key}:(${value})`;
  }

  const handleSearch = () => {
    console.log(afterValue, "afterValue", typeof afterValue);
    let query = [
        setValue("from", fromValue),
        setValue('to', toValue),
        setValue('subject', subjectValue),
        `${bodyValue||""}`,
        `${notHasValue? `-{${notHasValue}}` : ""}`,
        setValue('has', hasAttachement?'attachment':"", true),
        setValue('after', afterValue && afterValue.toISOString().split("T")[0].replace(/-/igm, "/"), true),
        setValue('before',beforeValue && beforeValue.toISOString().split("T")[0].replace(/-/gm, "/"), true)].filter(x=>x).join (" ");
        onClose(query);
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Filter</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>In:</Text>
        <TextInput
          value={inValue}
          onChangeText={setInValue}
          placeholder="Enter folder name"
          style={styles.input}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>From:</Text>
        <TextInput
          value={fromValue}
          onChangeText={setFromValue}
          placeholder="Enter sender name or email"
          style={styles.input}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>To:</Text>
        <TextInput
          value={toValue}
          onChangeText={setToValue}
          placeholder="Enter recipient name or email"
          style={styles.input}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Subject:</Text>
        <TextInput
          value={subjectValue}
          onChangeText={setSubjectValue}
          placeholder="Enter subject line"
          style={styles.input}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Doesn't have:</Text>
        <TextInput
          value={notHasValue}
          onChangeText={setNotHasValue}
          placeholder="Enter words not in message"
          style={styles.input}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Has words:</Text>
        <TextInput
          value={bodyValue}
          onChangeText={setBodyValue}
          placeholder="Enter words in message"
          style={styles.input}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Has attachment:</Text>
        <Checkbox
            status={hasAttachement ? 'checked' : 'unchecked'}
            onPress={() => {
                setHasAttachement(!hasAttachement);
            }}
            />
      </View>
      {/* <View style={styles.inputGroup}>
        <Text style={styles.label}>Size:</Text>
        <TextInput
          value={largerValue}
          onChangeText={setLargerValue}
          placeholder="Enter size in bytes"
          style={styles.input}
        />
      </View> */}
      <View style={styles.inputGroup}>       
        <DatePickerInput
            value={afterValue}
            locale='en'
            format="yyyy/MM/dd"
            onChange={(newDate) => setAfterValue(newDate)}
            label="Start Date"
        />
        <DatePickerInput
            value={beforeValue}
            locale='en'
            format="yyyy/MM/dd"
            style={{margin: 10}}
            onChange={(newDate) => setBeforeValue(newDate)}
            label="End Date"
        />
       
      </View>
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

// Define a StyleSheet object to store the styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#333',
    flex:1
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  input_40 :{
    width: '40%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000',
  }
});

export default AdvancedFilter;