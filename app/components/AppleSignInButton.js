import {
  AppleButton,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import auth from "@react-native-firebase/auth";

export default function AppleSignInButton({ which }) {
  const type =
    which === "in" ? AppleButton.Type.SIGN_IN : AppleButton.Type.SIGN_UP;

  async function onPress() {
    // Start the sign-in request

    let appleAuthRequestResponse;
    try {
      appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
    } catch (error) {
      return console.log(error);
    }

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      return console.log("Apple Sign-In failed - no identify token returned");
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce
    );

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  }

  return (
    <AppleButton
      buttonStyle={AppleButton.Style.BLACK}
      buttonType={type}
      style={{
        height: 45,
      }}
      onPress={onPress}
    />
  );
}
