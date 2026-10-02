import { Link, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AuthForm } from "../components/AuthForm";
import { registerUser, startSession } from "../services/authStorage";

export default function RegisterScreen() {
  async function handleRegister(email: string, password: string) {
    const registered = await registerUser({ email, password });

    if (!registered) {
      throw new Error("Ese email ya está registrado.");
    }

    await startSession(email);
    router.replace("/home");
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.appTitle}>ISTEA TASK MANAGER</Text>
        <Text style={styles.accountTitle}>Crear una cuenta</Text>
        <Text style={styles.description}>Registrate para empezar a organizar tus tareas.</Text>
        <AuthForm buttonLabel="Registrarme" onSubmit={handleRegister} />
        <Text style={styles.cardFooter}>
          ¿Ya tenés una cuenta? <Link href="/login" style={styles.link}>Iniciá sesión</Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eef4fb",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    elevation: 3,
    padding: 24,
    shadowColor: "#16263d",
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  appTitle: {
    color: "#208AEF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  accountTitle: {
    color: "#17202a",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 10,
  },
  description: {
    color: "#687282",
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 12,
    marginTop: 8,
  },
  cardFooter: {
    color: "#687282",
    fontSize: 14,
    marginTop: 22,
    textAlign: "center",
  },
  link: {
    color: "#208AEF",
    fontWeight: "700",
  },
});
