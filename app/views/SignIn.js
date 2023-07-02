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
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import auth from "@react-native-firebase/auth";
import GoogleSignInButton from "../components/GoogleSignInButton";
import AppleSignInButton from "../components/AppleSignInButton";

export default function SignIn({ navigation }) {
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

  async function signInWithEmailAndPassword() {
    setError("");

    if (!email || !password) return setError("Enter your email and password");

    try {
      setLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
      console.log("user signed in");
    } catch (err) {
      console.log(err);

      if (err.code === "auth/invalid-email") {
        setError("That email address is invalid");
      }

      if (err.code === "auth/user-not-found") {
        setError("This account does not exist");
      }

      if (err.code === "auth/wrong-password") {
        setError("Incorrect password");
      }
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword() {
    if (!email) return setError("Enter your email to reset your password");

    setError("");

    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert("Check your emails", "We sent you a password reset link");
    } catch (err) {
      if (err.code === "auth/invalid-email") {
        setError("That email address is invalid");
      }

      if (err.code === "auth/user-not-found") {
        setError("This account does not exist");
      }
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
            <View style={styles.signInButton}>
              <Button
                title="Sign in"
                color="#fff"
                onPress={signInWithEmailAndPassword}
              />
            </View>

            <Text style={styles.Or}>Or</Text>
            <View style={styles.socialSignIns}>
              <GoogleSignInButton which="in" />
              <AppleSignInButton which="in" />
            </View>
            <View style={styles.alreadyHaveAnAccount}>
              <Text>Don't have an account?</Text>
              <Button
                title="Sign Up"
                color="rgb(32, 137, 220)"
                onPress={() => navigation.replace("SignUp")}
              />
            </View>
            <TouchableOpacity
              style={styles.resetPasswordButton}
              onPress={resetPassword}
            >
              <Text style={styles.resetPasswordButtonText}>Reset password</Text>
            </TouchableOpacity>
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
  signInText: {
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
  signInButton: {
    backgroundColor: "rgb(32, 137, 220)",
    height: 40,
    borderRadius: 10,
    marginTop: 5,
    width: 200,
  },
  Or: {
    marginTop: 10,
    marginBottom: 10,
  },
  socialSignIns: {
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
  resetPasswordButton: {
    marginTop: 10,
  },
  resetPasswordButtonText: {
    color: "grey",
  },
});
