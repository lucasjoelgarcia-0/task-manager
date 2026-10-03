import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Task } from "../types/task";

type TaskListProps = {
  tasks: Task[];
  onDelete: (taskId: number) => void;
  onToggle: (taskId: number) => void;
};

export function TaskList({ tasks, onDelete, onToggle }: TaskListProps) {
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
            <Text style={[styles.taskTitle, task.isDone && styles.completedTaskText]}>
              {task.title}
            </Text>
            <Text style={[styles.taskText, task.isDone && styles.completedTaskText]}>
              {task.todo}
            </Text>
          </View>
          <Pressable onPress={() => {}} style={styles.actionButton}>
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
});
