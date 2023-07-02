import Swiper from "react-native-swiper";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";

export default function Welcome({ navigation }) {
  return (
    <Swiper loop={false}>
      <View style={styles.slide}>
        <Text style={styles.title}>
          Your dream AI assistant is finally here
        </Text>
        <Text style={styles.text}>
          You will be able to talk with the most advanced AI language model,
          like if it was your personal assistant.
        </Text>
        <Button
          title="Get Started!"
          buttonStyle={{
            marginTop: 50,
            borderRadius: 5,
            width: 200,
            height: 50,
          }}
          onPress={() => {
            navigation.replace("SignIn");
          }}
        />
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    paddingHorizontal: 20,
  },
});
