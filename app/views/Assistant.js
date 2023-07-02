import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import RecordButton from "../components/RecordButton";
import auth from "@react-native-firebase/auth";
import _ from "lodash";

// TODO: error handling & debounce & not handled promise rejection & flicker when we finish recording

export default function Assistant() {
  const user = auth().currentUser;
  const [hasAskedAssistant, setHasAskedAssistant] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();
  const [recordingStartTime, setRecordingStartTime] = useState(0);
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    (async () => {
      console.log(await user.getIdToken());
    })();
  }, []);

  useEffect(() => {
    const now = Date.now();

    // We contact the assistant only if the recording is longer than 1 second
    if (file && !hasAskedAssistant && now - recordingStartTime > 1000) {
      askAssistant();
    }
  }, [file]);

  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  async function requestMicrophonePermission() {
    try {
      const microphonePermission = PERMISSIONS.IOS.MICROPHONE;

      const status = await check(microphonePermission);

      if (status !== RESULTS.GRANTED) {
        const newStatus = await request(microphonePermission);

        if (newStatus !== RESULTS.GRANTED) {
          Alert.alert(
            "You need to give us permission to use your microphone",
            "Please go to your settings and enable the microphone permission for this app"
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setIsRecording(true);
      setRecordingStartTime(Date.now());
      setHasAskedAssistant(false);

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("stop");
    setIsRecording(false);

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.getURI();
      setFile(uri);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }

    setRecording(undefined);
  }

  async function askAssistant() {
    setLoading(true);
    setHasAskedAssistant(true);
    console.log("Asking assistant..");

    const formData = new FormData();
    formData.append("audioFile", {
      uri: file,
      type: "audio/wav",
      name: "recording.wav",
    });

    const token = await user.getIdToken();
    let response;

    try {
      response = await fetch(
        "https://voice-assistant.herokuapp.com/assistant",
        {
          method: "POST",
          body: formData,
          headers: {
            token,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error();
      }
    } catch (err) {
      setLoading(false);
      return Alert.alert("Error", "Something went wrong, please try again");
    }

    const fileURL = await response.text();

    // playing audio from elevenlabs
    let sound;

    try {
      const res = await Audio.Sound.createAsync({
        uri: "https://voice-assistant.herokuapp.com/" + fileURL,
      });
      sound = res.sound;
    } catch (err) {
      setLoading(false);
      return Alert.alert(
        "Error",
        "Couldn't play assistant's answer, please try again"
      );
    }

    setLoading(false);
    setPlaying(true);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setPlaying(false);
      }
    });

    await sound.playAsync();
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {!loading && !playing && (
          <View style={styles.microphoneContainer}>
            <RecordButton
              onPressIn={startRecording}
              onPressOut={stopRecording}
              isRecording={isRecording}
            />
            <Text style={styles.microphoneContainer.explanation}>
              {isRecording
                ? "Recording..."
                : "Press and hold the button, and ask your question!"}
            </Text>
          </View>
        )}
        {playing && (
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            🎵 Your assistant is speaking 🎵
          </Text>
        )}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingContainer.text}>
              Asking assistant...
            </Text>
            <Text style={styles.loadingContainer.subText}>
              AIs are still slow... for now
            </Text>
            <Text>This may take up to 15 seconds</Text>
          </View>
        )}
        {/* <ApplePayButton /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    padding: 8,
  },
  microphoneContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    explanation: {
      textAlign: "center",
      fontSize: 20,
      fontWeight: "bold",
      width: 300,
      height: 100,
      marginTop: 30,
    },
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,

    text: {
      fontSize: 20,
      fontWeight: "bold",
    },

    subText: {
      fontStyle: "italic",
      fontSize: 16,
      color: "grey",
    },
  },
});
