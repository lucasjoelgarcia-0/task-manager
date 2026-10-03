import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type NavbarProps = {
  onLogoutPress: () => void;
};

export function Navbar({ onLogoutPress }: NavbarProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onLogoutPress} style={styles.logoutButton}>
        <Ionicons color="#c0392b" name="log-out-outline" size={25} />
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
  logoutButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
});
