import React, {useState, useEffect} from 'react';
import {View, Text, Button, SafeAreaView} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import auth from '@react-native-firebase/auth';

export default function Login({navigation}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId: 'xxxx',
      offlineAccess: true,
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  });

  function onAuthStateChanged(user) {
    setUser(user);
    if (user) setLoggedIn(true);
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      setLoggedIn(true);

      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      await auth().signInWithCredential(credential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      auth()
        .signOut()
        .then(() => alert('You are signed out.'));
      setLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <SafeAreaView>
        <View
          style={{justifyContent: 'center', alignItems: 'center', height: 500}}>
          {user ? (
            <View style={{alignItems: 'center'}}>
              <Text>Welcome {user.displayName}</Text>
              <Button
                title="Go to Chat Room"
                onPress={() =>
                  navigation.navigate('Chatbot', {
                    name: user.displayName,
                    id: user.uid,
                  })
                }
              />
              <Button
                onPress={this.signOut}
                title="Logout"
                color="red"></Button>
            </View>
          ) : (
            <View>
              <Text>Please sign in to use the Chatbot</Text>
              <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this._signIn}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
