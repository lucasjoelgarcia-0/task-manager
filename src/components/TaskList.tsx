import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ImageThumbnail } from "./ImageThumbnail";
import { useLocalNotifications } from "../hooks/useLocalNotifications";
import { useTaskStore } from "../stores/taskStore";
import { Task } from "../types/task";

type TaskListProps = {
  tasks: Task[];
  onDelete: (taskId: number) => void;
  onToggle: (taskId: number) => void;
};

export function TaskList({ tasks, onDelete, onToggle }: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { scheduleNotification } = useLocalNotifications();
  const updateTask = useTaskStore((state) => state.updateTask);

  async function handleNotification(seconds: number) {
    if (!selectedTask) {
      return;
    }

    try {
      const notificationId = await scheduleNotification(selectedTask.todo, seconds);

      if (notificationId) {
        await updateTask({ ...selectedTask, notificationId });
      }
    } catch {
      // The task store exposes persistence errors to the screen.
    }

    setSelectedTask(null);
  }

  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskRow}>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.isDone }}
            onPress={() => {
              if (task.id !== undefined) {
                onToggle(task.id);
              }
            }}
            style={styles.checkbox}
          >
            <Ionicons
              color="#208AEF"
              name={task.isDone ? "checkbox" : "square-outline"}
              size={22}
            />
          </Pressable>
          <View style={styles.taskContent}>
            <ImageThumbnail size={56} uri={task.imageUri} />
            <Text style={[styles.taskTitle, task.isDone && styles.completedTaskText]}>
              {task.title}
            </Text>
            <Text style={[styles.taskText, task.isDone && styles.completedTaskText]}>
              {task.todo}
            </Text>
            {task.completionDate ? (
              <Text style={styles.completionDateText}>
                Fecha de finalización: {task.completionDate.toLocaleDateString("es-AR")}
              </Text>
            ) : null}
            {task.location ? (
              <Text style={styles.locationText}>
                Ubicación: {[task.location.country, task.location.province]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            ) : null}
            {task.responsibleContact ? (
              <Text style={styles.responsibleText}>
                Responsable: {[task.responsibleContact.firstName, task.responsibleContact.lastName]
                  .filter(Boolean)
                  .join(" ")}
              </Text>
            ) : null}
          </View>
          <Pressable onPress={() => setSelectedTask(task)} style={styles.actionButton}>
            <Ionicons color="#208AEF" name="notifications-outline" size={22} />
          </Pressable>
          <Pressable
            onPress={() => {
              if (task.id !== undefined) {
                onDelete(task.id);
              }
            }}
            style={styles.actionButton}
          >
            <Ionicons color="#c0392b" name="trash-outline" size={22} />
          </Pressable>
        </View>
      ))}
      <Modal animationType="slide" transparent visible={selectedTask !== null}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Programar notificación</Text>
            <Pressable onPress={() => handleNotification(3)} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Mostrar en 3 segundos</Text>
            </Pressable>
            <Pressable onPress={() => handleNotification(30)} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Mostrar en 30 segundos</Text>
            </Pressable>
            <Pressable onPress={() => handleNotification(60)} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Mostrar en 1 minuto</Text>
            </Pressable>
            <Pressable onPress={() => setSelectedTask(null)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 28,
    width: "100%",
  },
  taskRow: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
  },
  taskText: {
    color: "#17202a",
    fontSize: 16,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    color: "#17202a",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  responsibleText: {
    color: "#566171",
    fontSize: 13,
    marginTop: 4,
  },
  completionDateText: {
    color: "#566171",
    fontSize: 13,
    marginTop: 4,
  },
  locationText: {
    color: "#566171",
    fontSize: 13,
    marginTop: 4,
  },
  completedTaskText: {
    textDecorationLine: "line-through",
  },
  checkbox: {
    marginRight: 8,
    padding: 2,
  },
  actionButton: {
    marginLeft: 8,
    padding: 4,
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  modalTitle: {
    color: "#17202a",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  modalOption: {
    borderColor: "#d9dee5",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
    padding: 13,
  },
  modalOptionText: {
    color: "#17202a",
    fontSize: 16,
  },
  cancelButton: {
    alignItems: "center",
    marginTop: 12,
    padding: 10,
  },
  cancelText: {
    color: "#c0392b",
    fontWeight: "700",
  },
});
