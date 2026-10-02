import {router} from "expo-router";
import {useEffect} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {closeSession, hasActiveSession} from "../services/authStorage";

export default function HomeScreen() {
    useEffect(() => {
        async function checkSession() {
            const sessionIsActive = await hasActiveSession();

            if (!sessionIsActive) {
                router.replace("/register");
            }
        }

        checkSession();
    }, []);

    async function handleLogout() {
        await closeSession();
        router.replace("/login");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¡Bienvenido!</Text>
            <Text style={styles.description}>Ya podés empezar a organizar tus tareas.</Text>
            <Pressable onPress={handleLogout} style={styles.button}>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "#eef4fb",
        flex: 1,
        justifyContent: "center",
        padding: 24
    },
    title: {
        color: "#17202a",
        fontSize: 30,
        fontWeight: "800"
    },
    description: {
        color: "#687282",
        fontSize: 16,
        marginTop: 8
    },
    button: {
        backgroundColor: "#208AEF",
        borderRadius: 12,
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 14
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700"
    },
});
