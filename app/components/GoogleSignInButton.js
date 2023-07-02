import React from "react";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const GoogleSignInButton = ({ which }) => {
  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (err) {
      console.log("Google sign in error", err);
    }
  }

  return (
    <Button
      onPress={onGoogleButtonPress}
      icon={<Icon name="google" size={20} color="grey" />}
      title={`Sign ${which} with Google`}
      buttonStyle={{
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingHorizontal: 15,
        borderColor: "lightgrey",
        borderWidth: 1,
        height: 45,
      }}
      titleStyle={{ color: "grey", marginLeft: 10, fontSize: 17 }}
    />
  );
};

export default GoogleSignInButton;
