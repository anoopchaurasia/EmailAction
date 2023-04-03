import { useEffect, useState } from 'react';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import {View, Button, Text} from 'react-native';
GoogleSignin.configure({
    webClientId: '977286924231-mil75iap3q03f0fj7c6h6flcp0b124nk.apps.googleusercontent.com',
    scopes: ['https://mail.google.com/'], // what API you want to access on behalf of the user, default is email and profile
    offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    //  hostedDomain: '', // specifies a hosted domain restriction
    //  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    accountName: '', // [Android] specifies an account name on the device that should be used
    profileImageSize: 120, // 
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
      const query = 'is:unread'; // Only get new messages
      const limit = 99; // Only get 10 messages

      // // Build the API endpoint URL with the query parameters
      const apiUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${limit}`;
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
  return (
    <View>
    {user ? (
      <>
        <Button title="Sign Out" onPress={signOut} />
        <View>
          <Text>Welcome {user.name}!</Text>
          <Text>Your email address is {user.email}</Text>
        </View>
      </>
    ) : (
      <>
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
        <Text>Please sign in to continue.</Text>
      </>
    )}
  </View>
  )
}

export default MyComponent;