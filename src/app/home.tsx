import {router} from "expo-router";
import {useEffect} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {closeSession, hasActiveSession} from "../services/authStorage";
import {Navbar} from "../components/Navbar";
import {TaskList} from "../components/TaskList";
import {useTaskStore} from "../stores/taskStore";
import {hasCompletedTasks} from "../utils/taskUtils";

export default function HomeScreen() {
    const tasks = useTaskStore((state) => state.tasks);
    const loadTasks = useTaskStore((state) => state.loadTasks);
    const deleteTask = useTaskStore((state) => state.deleteTask);
    const toggleTask = useTaskStore((state) => state.toggleTask);
    const taskError = useTaskStore((state) => state.error);

    useEffect(() => {
        async function checkSession() {
            const sessionIsActive = await hasActiveSession();

            if (!sessionIsActive) {
                router.replace("/register");
            }
        }

        checkSession();

        loadTasks().catch(() => undefined);
    }, [loadTasks]);

    async function handleDelete(taskId: number) {
        try {
            await deleteTask(taskId);
        } catch {
            // The store exposes the error to the screen.
        }
    }

    async function handleToggle(taskId: number) {
        try {
            await toggleTask(taskId);
        } catch {
            // The store exposes the error to the screen.
        }
    }

    async function handleLogout() {
        await closeSession();
        router.replace("/login");
    }

    return (
        <View style={styles.screen}>
            <Navbar onLogoutPress={handleLogout} />
            <View style={styles.container}>
                {tasks.length === 0 ? (
                    <>
                        <Text style={styles.title}>¡Bienvenido!</Text>
                        <Text style={styles.description}>Ya podés empezar a organizar tus tareas.</Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.title}>Mis tareas</Text>
                        <Text style={styles.description}>Para crear tareas presioná &quot;Agregar tareas&quot;.</Text>
                    </>
                )}
                <TaskList
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    tasks={tasks.filter((task) => !task.isDone)}
                />
                {hasCompletedTasks(tasks) ? (
                    <>
                        <Text style={styles.completedTitle}>Finalizadas</Text>
                        <TaskList
                            onDelete={handleDelete}
                            onToggle={handleToggle}
                            tasks={tasks.filter((task) => task.isDone)}
                        />
                    </>
                ) : null}
                {taskError ? <Text style={styles.error}>{taskError}</Text> : null}
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
    error: {
        color: "#c0392b",
        fontSize: 14,
        marginTop: 16
    },
    completedTitle: {
        color: "#17202a",
        fontSize: 20,
        fontWeight: "700",
        marginTop: 28
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
