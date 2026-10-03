import { StyleSheet, Text, View } from "react-native";

export default function AltaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Aquí podrás crear tus tareas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#eef4fb",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  text: {
    color: "#17202a",
    fontSize: 18,
    textAlign: "center",
  },
});
