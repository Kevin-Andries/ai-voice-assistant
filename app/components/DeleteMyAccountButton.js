import { Alert, Button } from "react-native";
import auth from "@react-native-firebase/auth";

export default function DeleteMyAccountButton({ onClick }) {
  return (
    <Button
      title="Delete my account"
      color="red"
      onPress={() => {
        Alert.alert(
          "Delete Account",
          "\nAre you sure you want to delete your account?\n\nThis action is irreversible",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              onPress: async () => {
                onClick();
                const user = auth().currentUser;
                try {
                  await user.delete();
                  Alert.alert("Account deleted");
                } catch (err) {
                  if (err.code === "auth/requires-recent-login") {
                    Alert.alert(
                      "You need to sign in again",
                      "Please sign in again to delete your account, as this is a sensitive operation"
                    );
                    auth().signOut();
                  }
                }
              },
            },
          ]
        );
      }}
    />
  );
}
