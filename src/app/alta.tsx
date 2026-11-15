import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { ImageThumbnail } from "../components/ImageThumbnail";
import { DeviceServices } from "../components/DeviceServices";
import { TaskInfoCard } from "../components/TaskInfoCard";
import { TaskList } from "../components/TaskList";
import type { ContactDetails } from "../types/contact";
import type { LocationDetails } from "../services/device-apis/location/location";
import { useTaskStore } from "../stores/taskStore";
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
  const [title, setTitle] = useState("");
  const [todo, setTodo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationDetails | null>(null);
  const [locationError, setLocationError] = useState("");
  const [responsibleContact, setResponsibleContact] = useState<ContactDetails | null>(null);
  const [completionDate, setCompletionDate] = useState<Date | null>(null);
  const [taskExample] = useState(getRandomTaskExample);
  const tasks = useTaskStore((state) => state.tasks);
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const addTask = useTaskStore((state) => state.addTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const taskError = useTaskStore((state) => state.error);

  useEffect(() => {
    loadTasks().catch(() => undefined);
  }, [loadTasks]);

  async function handleSave() {
    if (!title.trim()) {
      setErrorMessage("Completá el título y la tarea.");
      return;
    }

    if (!todo.trim()) {
      setErrorMessage("Escribí una tarea.");
      return;
    }

    try {
      await addTask({
        id: 0,
        title: title.trim(),
        todo: todo.trim(),
        completionDate,
        imageUri,
        responsibleContact,
        isDone: false,
        withNotification: false,
        notificationDate: new Date(),
      });
    } catch {
      return;
    }

    setTitle("");
    setTodo("");
    setImageUri(null);
    setResponsibleContact(null);
    setCompletionDate(null);
    setErrorMessage("");
  }

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear tareas</Text>
      <Text style={styles.label}>Título</Text>
      <TextInput
        onChangeText={setTitle}
        placeholder="Título de la tarea"
        placeholderTextColor="#8a8f98"
        style={styles.titleInput}
        value={title}
      />
      <Text style={styles.label}>Creá una nueva tarea, por ejemplo:</Text>
      <TextInput
        onChangeText={setTodo}
        placeholder={taskExample}
        placeholderTextColor="#8a8f98"
        style={styles.input}
        value={todo}
      />
      <ImageThumbnail uri={imageUri} />
      {location ? (
        <TaskInfoCard
          title="Ubicación actual"
          value={[location.country, location.province].filter(Boolean).join(", ")}
        />
      ) : null}
      {locationError ? <Text style={styles.locationError}>{locationError}</Text> : null}
      {responsibleContact ? (
        <TaskInfoCard
          secondaryValue={responsibleContact.email || undefined}
          title="Responsable de la tarea"
          value={[responsibleContact.firstName, responsibleContact.lastName].filter(Boolean).join(" ")}
        />
      ) : null}
      {completionDate ? (
        <TaskInfoCard
          title="Fecha de finalización"
          value={completionDate.toLocaleDateString("es-AR")}
        />
      ) : null}
      <DeviceServices
        onContactSelected={setResponsibleContact}
        onImageSelected={setImageUri}
        onLocationDetected={(detectedLocation) => {
          setLocation(detectedLocation);
          setLocationError("");
        }}
        onLocationError={setLocationError}
        onCalendarDateSelected={setCompletionDate}
        taskDescription={todo}
        taskTitle={title}
      />
      <Pressable onPress={handleSave} style={styles.addButton}>
        <Text style={styles.addText}>Crear</Text>
      </Pressable>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {taskError ? <Text style={styles.error}>{taskError}</Text> : null}

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
  titleInput: {
    backgroundColor: "#ffffff",
    borderColor: "#d9dee5",
    borderRadius: 12,
    borderWidth: 1,
    color: "#17202a",
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#d9dee5",
    borderRadius: 12,
    borderWidth: 1,
    color: "#17202a",
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: "#208AEF",
    borderColor: "#166fbe",
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 13,
    width: "100%",
  },
  addText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  error: {
    color: "#c0392b",
    fontSize: 14,
    marginTop: 16,
  },
  locationError: {
    color: "#c0392b",
    fontSize: 13,
    marginTop: 8,
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
