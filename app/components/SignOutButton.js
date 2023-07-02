import { Alert, Button } from "react-native";
import auth from "@react-native-firebase/auth";

export default function SignOutButton({ onClick }) {
  return (
    <Button
      title="Sign out"
      color="red"
      onPress={() => {
        Alert.alert("Sign out", "Are you sure you want to sign out?", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              onClick();
              auth().signOut();
            },
          },
        ]);
      }}
    />
  );
}
