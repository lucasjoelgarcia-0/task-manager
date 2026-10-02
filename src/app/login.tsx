import { Link, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AuthForm } from "../components/AuthForm";
import { startSession, validateUser } from "../services/authStorage";

export default function LoginScreen() {
  async function handleLogin(email: string, password: string) {
    const isValidUser = await validateUser({ email, password });

    if (!isValidUser) {
      throw new Error("El email o la contraseña son incorrectos.");
    }

    await startSession(email);
    router.replace("/home");
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>ISTEA TASK MANAGER</Text>
        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.description}>Ingresá tus datos para continuar.</Text>
        <AuthForm buttonLabel="Ingresar" onSubmit={handleLogin} />
        <Text style={styles.footerText}>
          ¿Todavía no tenés una cuenta? <Link href="/register" style={styles.link}>Registrate</Link>
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
  eyebrow: {
    color: "#208AEF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
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
  footerText: {
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
