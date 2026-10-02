import { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type AuthFormProps = {
  buttonLabel: string;
  onSubmit: (email: string, password: string) => Promise<void>;
};

export function AuthForm({ buttonLabel, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Completá el email y la contraseña.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setErrorMessage("Ingresá un email válido.");
      return;
    }

    setErrorMessage("");

    try {
      await onSubmit(email.trim().toLowerCase(), password);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("No se pudo completar la operación. Intentá nuevamente.");
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      style={styles.keyboardView}
    >
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="tu@email.com"
          placeholderTextColor="#8a8f98"
          style={styles.input}
          value={email}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setPassword}
          placeholder="Ingresá tu contraseña"
          placeholderTextColor="#8a8f98"
          secureTextEntry
          style={styles.input}
          value={password}
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    width: "100%",
  },
  form: {
    gap: 10,
  },
  label: {
    color: "#273142",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
  },
  input: {
    backgroundColor: "#f4f6f8",
    borderColor: "#d9dee5",
    borderRadius: 12,
    borderWidth: 1,
    color: "#17202a",
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  error: {
    color: "#c0392b",
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#208AEF",
    borderRadius: 12,
    marginTop: 14,
    paddingVertical: 14,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
