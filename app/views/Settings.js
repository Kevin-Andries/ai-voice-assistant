import { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DeleteMyAccountButton from "../components/DeleteMyAccountButton";
import SignOutButton from "../components/SignOutButton";

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SafeAreaView>
      <View
        style={{
          ...styles.container,
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
      >
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <View style={styles.text}>
              <Text style={{ fontSize: 16 }}>
                I created this app for you to experiment with an AI assistant
                for free.
              </Text>
              <Text style={{ fontSize: 16 }}>
                Please be aware that AIs are still new in our lives, and there
                are still some technical issues.
              </Text>
              <Text style={{ fontSize: 16 }}>
                If you have any questions, suggestion, or just want to talk
                because you feel lonely, please contact me at:
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                kevin.andries.tech@gmail.com
              </Text>
            </View>
            <View>
              <View style={styles.divider} />
              <SignOutButton onClick={() => setIsLoading(true)} />
              <DeleteMyAccountButton onClick={() => setIsLoading(true)} />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
    height: "100%",
    paddingTop: 20,
    padding: 10,
  },
  text: {
    display: "flex",
    gap: 10,
    padding: 10,
  },
  divider: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    marginVertical: 10,
    marginHorizontal: 10,
  },
});
