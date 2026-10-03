import {router} from "expo-router";
import {useEffect, useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {closeSession, hasActiveSession} from "../services/authStorage";
import {Navbar} from "../components/Navbar";
import {TaskList} from "../components/TaskList";
import {deleteTask, getTasks, Task} from "../services/taskStorage";

export default function HomeScreen() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        async function checkSession() {
            const sessionIsActive = await hasActiveSession();

            if (!sessionIsActive) {
                router.replace("/register");
            }
        }

        checkSession();

        async function loadTasks() {
            const storedTasks = await getTasks();
            setTasks(storedTasks);
        }

        loadTasks();
    }, []);

    async function handleDelete(taskId: number) {
        await deleteTask(taskId);
        setTasks(tasks.filter((task) => task.id !== taskId));
    }

    async function handleLogout() {
        await closeSession();
        router.replace("/login");
    }

    return (
        <View style={styles.screen}>
            <Navbar onLogoutPress={handleLogout} />
            <View style={styles.container}>
                <Text style={styles.title}>¡Bienvenido!</Text>
                <Text style={styles.description}>Ya podés empezar a organizar tus tareas.</Text>
                <TaskList onDelete={handleDelete} tasks={tasks} />
                <Pressable onPress={() => router.push("/alta")} style={styles.button}>
                    <Text style={styles.buttonText}>Agregar tareas</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "#eef4fb",
        flex: 1
    },
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
