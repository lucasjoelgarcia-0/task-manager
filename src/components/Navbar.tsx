import { Pressable, StyleSheet, Text, View } from "react-native";

type NavbarProps = {
  onAddPress: () => void;
};

export function Navbar({ onAddPress }: NavbarProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onAddPress} style={styles.addButton}>
        <Text style={styles.addText}>+</Text>
      </Pressable>
      <Text style={styles.title}>ISTEA Task Manager</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    color: "#17202a",
    fontSize: 20,
    fontWeight: "800",
    marginLeft: 16,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  addText: {
    color: "#000000",
    fontSize: 30,
    lineHeight: 32,
  },
});
