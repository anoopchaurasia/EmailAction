import React, { useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import BottomBar from '../component/BottomBarView';
import { DatePickerInput, registerTranslation, en, tr } from 'react-native-paper-dates';
import MyText from './../component/MyText';
registerTranslation('en', en);

function Field({ value, label, onChangeText, placeholder }) {
  return (
    <View style={styles.inputGroup}>
      <MyText style={styles.label}>{label}</MyText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
      />
    </View>
  )
}

const AdvancedFilter = ({ onClose, query_init }) => {
  query_init = query_init || {};
  // Declare state variables for each input field
  let query = query_init.query || {};
  const [fromValue, setFromValue] = React.useState(query.from || '');
  const [password, setPassword] = React.useState(query_init.pdf_password || '');
  const [toValue, setToValue] = React.useState(query.to || '');
  const [subjectValue, setSubjectValue] = React.useState(query.subject || '');
  const [notHasValue, setNotHasValue] = React.useState(query.notHas || '');
  const [bodyValue, setBodyValue] = React.useState(query.body || '');
  const [hasAttachement, setHasAttachement] = React.useState(query.has || true);
  //const [largerValue, setLargerValue] = React.useState('');
  const [afterValue, setAfterValue] = React.useState(query.after1 || '');
  const [beforeValue, setBeforeValue] = React.useState(query.before1 || '');
  const [queryName, setQueryName] = React.useState(query_init.name || '');
  // Declare a function to handle the search button press


  const handleSearch = () => {
    if (!queryName) return console.error("Name is not provided");

    let query = {
      from: fromValue,
      to: toValue,
      subject: subjectValue,
      body: bodyValue,
      notHas: notHasValue,
      has: hasAttachement,
      after: afterValue,
      before: beforeValue
    }

    onClose({ ...query_init, query, name: queryName, pdf_password: password });

  };

  let actionList = [{
    name: "Create",
    icon: "plus",
    action: handleSearch
  }];

  return (
    <View style={styles.container}>
      <View style={{flex:1, padding: 10}}>
        <MyText style={styles.title}>Advanced Filter</MyText>
        <Field value={queryName} label="Name" onChangeText={setQueryName} placeholder="Enter Query Name" />
        <Field value={password}  label="Passowrd" onChangeText={setPassword} placeholder="Enter PDF Password" />
        <Field value={fromValue}  label="Sender" onChangeText={setFromValue} placeholder="Enter sender name or email" />
        <Field value={toValue}  label="Receiver" onChangeText={setToValue} placeholder="Enter recipient name or email" />
        <Field value={subjectValue}  label="Subject" onChangeText={setSubjectValue} placeholder="Enter subject line" />
        <Field value={notHasValue}  label="Ignore Text" onChangeText={setNotHasValue} placeholder="Enter words not in message" />
        <Field value={bodyValue}  label="Body Text" onChangeText={setBodyValue} placeholder="Enter words in message" />

        {/* <View style={styles.inputGroup}>
        <MyText style={styles.label}>Size:</MyText>
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
            style={{ margin: 10 }}
            onChange={(newDate) => setBeforeValue(newDate)}
            label="End Date"
          />
        </View>
      </View>
      <View style={{ height: 40, }}>
        <BottomBar style={{ backgroundColor: "#ddd" }} list={actionList} />
      </View>
    </View>
  );
};

// Define a StyleSheet object to store the styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:10,
    flexDirection:"column",
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
    flex: 1
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
  input_40: {
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