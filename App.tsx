import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';
import {GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '977286924231-li1rlfhqv91ndpr9pqlr52mt0t5ii2jj.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//  hostedDomain: '', // specifies a hosted domain restriction
//  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
  profileImageSize: 120, // 
});

const App = () => {
  const [userInfo, setUserInfo] = useState(null);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
    } catch (error) {
      console.log('Error:', JSON.stringify(error));
      console.log(error.code);
    }
  };

  return (
    <View>
      <GoogleSigninButton
        style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
      {userInfo && (
        <View>
          <Text>{userInfo.user.name}</Text>
          <Text>{userInfo.user.email}</Text>
        </View>
      )}
    </View>
  );
};

export default App;