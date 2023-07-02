import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import auth from "@react-native-firebase/auth";
import GoogleSignInButton from "../components/GoogleSignInButton";
import AppleSignInButton from "../components/AppleSignInButton";

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onEmailChange(email) {
    setEmail(email);
  }

  function onPasswordChange(password) {
    setPassword(password);
  }

  async function signUpWithEmailAndPassword() {
    setError("");

    if (!email || !password) return setError("Enter your email and password");

    try {
      setLoading(true);
      await auth().createUserWithEmailAndPassword(email, password);
      console.log("user created & signed in");
    } catch (err) {
      console.log(err);
      if (err.code === "auth/email-already-in-use") {
        setError("That email address is already in use");
      }

      if (err.code === "auth/invalid-email") {
        setError("That email address is invalid");
      }

      if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View
            style={{
              ...styles.formContainer,
              opacity: loading ? 0.5 : 1,
              pointerEvents: loading ? "none" : "auto",
            }}
          >
            {loading && (
              <ActivityIndicator
                size="large"
                style={{
                  position: "absolute",
                }}
              />
            )}
            <View>
              <TextInput
                style={styles.input}
                placeholderTextColor="grey"
                placeholder="Email"
                value={email}
                onChangeText={onEmailChange}
              />
              <TextInput
                style={styles.input}
                placeholderTextColor="grey"
                placeholder="Password"
                value={password}
                onChangeText={onPasswordChange}
                secureTextEntry
              />
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.createAccountButton}>
              <Button
                title="Create Account"
                color="#fff"
                onPress={signUpWithEmailAndPassword}
              />
            </View>

            <Text style={styles.Or}>Or</Text>
            <View style={styles.socialSignUps}>
              <GoogleSignInButton which="up" />
              <AppleSignInButton which="up" />
            </View>
            <View style={styles.alreadyHaveAnAccount}>
              <Text>Already have an account?</Text>
              <Button
                title="Sign In"
                color="rgb(32, 137, 220)"
                onPress={() => navigation.replace("SignIn")}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",

    height: "100%",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    height: 460,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  signUpText: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "lightgrey",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    padding: 5,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
  },
  createAccountButton: {
    backgroundColor: "rgb(32, 137, 220)",
    borderRadius: 10,
    marginTop: 5,
    width: 200,
  },
  Or: {
    marginTop: 10,
    marginBottom: 10,
  },
  socialSignUps: {
    display: "flex",
    marginBottom: 10,
    gap: 12,
    width: 200,
  },
  alreadyHaveAnAccount: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "lightgrey",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
