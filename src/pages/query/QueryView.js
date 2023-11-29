import React, { useEffect } from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {DatePickerInput, registerTranslation, en, tr} from 'react-native-paper-dates';

registerTranslation('en', en);


const AdvancedFilter = ({onClose, query_init}) => {
  query_init = query_init ||{};
  // Declare state variables for each input field
  let query= query_init.query ||{};
  const [fromValue, setFromValue] = React.useState(query.from || '');
  const [password, setPassword] = React.useState(query_init.pdf_password || '');
  const [toValue, setToValue] = React.useState(query.to || '');
  const [subjectValue, setSubjectValue] = React.useState(query.subject || '');
  const [notHasValue, setNotHasValue] = React.useState(query.notHas || '');
  const [bodyValue, setBodyValue] = React.useState(query.body|| '');
  const [hasAttachement, setHasAttachement] = React.useState(query.has || true);
  //const [largerValue, setLargerValue] = React.useState('');
  const [afterValue, setAfterValue] = React.useState(query.after1 || '');
  const [beforeValue, setBeforeValue] = React.useState(query.before1 || '');
  const [queryName, setQueryName] = React.useState(query_init.name || '');
  // Declare a function to handle the search button press


  const handleSearch = () => {
    if(!queryName) return console.error("Name is not provided");

    let query = {
      from: fromValue,
      to:toValue,
      subject: subjectValue,
      body: bodyValue,
      notHas: notHasValue,
      has: hasAttachement,
      after: afterValue,
      before: beforeValue
    }

      onClose({...query_init,  query, name: queryName, pdf_password: password});
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Filter</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Save As</Text>
        <TextInput
          value={queryName}
          onChangeText={setQueryName}
          placeholder="Enter Query Name"
          style={styles.input}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>password:</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter PDF Password"
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