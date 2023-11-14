import { useEffect, useState } from 'react';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import {View, Button, Text, TouchableOpacity, StyleSheet} from 'react-native';
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


const MyComponent = () => {
    const [user, setUser] = useState(null);
    useEffect(x=>{
        GoogleSignin.signInSilently().then(user=>{
            setUser(user.user);
            console.log(user.user);
        });
    }, [])

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      let loggedInUser = loggedInUser || ( await GoogleSignin.signIn());      
      setUser(loggedInUser.user);
      // Build the query parameters
      console.log(loggedInUser.user);
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
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser(null);
    } catch (error) {
      console.log(error.message);
    }
  };
  const isSignedIn = false;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Google Login</Text>
      {isSignedIn ? (
        <>
          <Text style={styles.label}>Welcome {user.name}</Text>
          <TouchableOpacity style={styles.button} onPress={signOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <GoogleSigninButton style={styles.button} size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={signIn} />
          <Text style={styles.label}>By signing in, you agree to our</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.example.com/terms-and-conditions')}>
            <Text style={styles.link}>Terms and Conditions</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
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
});


export default MyComponent;