import { useEffect, useState } from 'react';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { View, Button, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
GoogleSignin.configure({
  webClientId: '977286924231-mil75iap3q03f0fj7c6h6flcp0b124nk.apps.googleusercontent.com',
  scopes: ['https://mail.google.com/'], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  //  hostedDomain: '', // specifies a hosted domain restriction
  //  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  // accountName: '', // [Android] specifies an account name on the device that should be used
  profileImageSize: 120, // 
  forceCodeForRefreshToken: true,
});


const MyComponent = ({ onLoginSuccess }) => {
  let [signInRequired, setSigninRequired] = useState(false);
  useEffect(x => {
    GoogleSignin.signInSilently().then(user => {
      onLoginSuccess(true);
    }).catch(e=> 
      { setSigninRequired(true);
        console.error("user not logged in", e)
      });
  }, [])
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      (await GoogleSignin.signIn());
      onLoginSuccess(true);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
        console.log('Login cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Login in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.log(error.message, JSON.stringify(error));
      }
    }
  };


  if (signInRequired==false) return <View></View>


  return (
    <View style={styles.container}>
      <View style={styles.appName}>
      <Image
      source={require('./../assets/email-action-icon.png')}
      style={{ width: 100, height: 100 }}
    />
        <Text style={styles.appName_text}>Email Action</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.feature}>
          <Text style={{ maxWidth: 40, marginRight: 10, fontSize: 20 }}>📧</Text>
          <Text style={{ flex: 1 }}>
            <Text style={styles.title}>Clean Inbox:  </Text>
            Easily manage and declutter your inbox hassle-free.
          </Text>
        </View>
        <View style={styles.feature}>
          <Text style={{ maxWidth: 40, marginRight: 10, fontSize: 20 }}>🔍</Text>
          <Text style={{ flex: 1 }}>
            <Text style={styles.title}>Create Filters:  </Text>
            Organize emails effortlessly with custom filters.
          </Text>
        </View>
        <View style={styles.feature}>
          <Text style={{ maxWidth: 40, marginRight: 10, fontSize: 20 }}> 📎</Text>
          <Text style={{ flex: 1 }}>
            <Text style={styles.title}>PDF Viewer:  </Text>
            View attachments seamlessly within the app.
          </Text>
        </View>
        <View style={styles.feature}>
          <Text style={{ maxWidth: 40, marginRight: 10, fontSize: 20 }}>🔒</Text>
          <Text style={{ flex: 1 }}>
            <Text style={styles.title}>Your Privacy Matters:  </Text>
            Your data is securely stored in the app. No external servers except for Gmail API for essential email access.
          </Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text>
          Enjoy a clutter-free inbox experience while ensuring your privacy is prioritized.
        </Text>
      </View>
      <View style={{ alignContent: "center", flex: 1, justifyContent: 'flex-end', paddingBottom: 100 }}>
        <>
          <GoogleSigninButton style={styles.button} size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={signIn} />
          <Text style={styles.label}>By signing in, you agree to our</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.example.com/terms-and-conditions')}>
            <Text style={styles.link}>Terms and Conditions</Text>
          </TouchableOpacity>
        </>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
    padding: 20
  },
  label: {
    fontSize: 16,
    margin: 10,
  },
  button: {
    width: 240,
    height: 48,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#4285F4',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  link: {
    fontSize: 16,
    color: '#4285F4',
    textDecorationLine: 'underline',
  },
  info: {
    fontSize: 14,
    color: '#333',
    padding: 20,
  },
  feature: {
    marginTop: 10,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    lineHeight: 2

  },
  row: {
    flexDirection: 'column',
    maxHeight: 225,
    padding: 20,
  },
  appName: {
    alignContent: 'center',
  },
  "appName_text": {
    fontSize: 20
  }
});


export default MyComponent;