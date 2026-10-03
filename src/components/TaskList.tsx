import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Task } from "../services/taskStorage";

type TaskListProps = {
  tasks: Task[];
  onDelete: (taskId: number) => void;
};

export function TaskList({ tasks, onDelete }: TaskListProps) {
  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskRow}>
          <Text style={styles.taskText}>{task.todo}</Text>
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
    flex: 1,
    fontSize: 16,
  },
  actionButton: {
    marginLeft: 8,
    padding: 4,
  },
});
