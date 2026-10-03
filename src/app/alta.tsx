import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { deleteTask, saveTask, toggleTask } from "../services/taskStorage";
import { TaskList } from "../components/TaskList";
import { Task } from "../types/task";
import { hasCompletedTasks } from "../utils/taskUtils";

const taskExamples = [
  "Ordenar la casa",
  "Cocinar la cena",
  "Pasear al perro",
  "Lavar el auto",
];

function getRandomTaskExample(): string {
  const randomIndex = Math.floor(Math.random() * taskExamples.length);
  return taskExamples[randomIndex];
}

export default function AltaScreen() {
  const [todo, setTodo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskExample] = useState(getRandomTaskExample);

  async function handleSave() {
    if (!todo.trim()) {
      setErrorMessage("Escribí una tarea.");
      return;
    }

    const newTask = await saveTask({
      id: 0,
      todo: todo.trim(),
      isDone: false,
      withNotification: false,
      notificationDate: new Date(),
    });

    setTasks([...tasks, newTask]);
    setTodo("");
    setErrorMessage("");
  }

  async function handleDelete(taskId: number) {
    await deleteTask(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
  }

  async function handleToggle(taskId: number) {
    const updatedTask = await toggleTask(taskId);

    if (updatedTask) {
      setTasks(tasks.map((task) => task.id === taskId ? updatedTask : task));
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear tareas</Text>
      <Text style={styles.label}>Creá una nueva tarea, por ejemplo:</Text>
      <View style={styles.inputRow}>
        <TextInput
          onChangeText={setTodo}
          placeholder={taskExample}
          placeholderTextColor="#8a8f98"
          style={styles.input}
          value={todo}
        />
        <Pressable onPress={handleSave} style={styles.addButton}>
          <Text style={styles.addText}>+</Text>
        </Pressable>
      </View>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

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

      <Pressable onPress={() => router.replace("/home")} style={styles.backButton}>
        <Text style={styles.backText}>Volver</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eef4fb",
    flexGrow: 1,
    padding: 24,
  },
  title: {
    color: "#17202a",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 28,
    marginTop: 40,
  },
  label: {
    color: "#273142",
    fontSize: 15,
    fontWeight: "600",
  },
  inputRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#d9dee5",
    borderRadius: 12,
    borderWidth: 1,
    color: "#17202a",
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: "#208AEF",
    borderColor: "#166fbe",
    borderRadius: 12,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  addText: {
    color: "#ffffff",
    fontSize: 30,
    lineHeight: 32,
  },
  error: {
    color: "#c0392b",
    fontSize: 14,
    marginTop: 16,
  },
  completedTitle: {
    color: "#17202a",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 28,
  },
  backButton: {
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 12,
  },
  backText: {
    color: "#208AEF",
    fontSize: 15,
    fontWeight: "700",
  },
});
