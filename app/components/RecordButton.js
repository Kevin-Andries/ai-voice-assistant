import { IconButton, Colors } from "react-native-paper";

export default function RecordButton({ onPressIn, onPressOut, isRecording }) {
  return (
    <IconButton
      icon="microphone"
      iconColor={isRecording ? "black" : "white"}
      size={200}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => {}}
      style={{
        backgroundColor: isRecording ? "lightgreen" : "rgb(32, 137, 220)",
      }}
    />
  );
}
