import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types/task";

const TASKS_KEY = "tasks";

export async function getTasks(): Promise<Task[]> {
  const storedTasks = await AsyncStorage.getItem(TASKS_KEY);

  if (!storedTasks) {
    return [];
  }

  const tasks = JSON.parse(storedTasks) as Task[];

  return tasks.map((task) => ({
    ...task,
    notificationDate: new Date(task.notificationDate),
  }));
}

export async function saveTask(task: Task): Promise<Task> {
  const tasks = await getTasks();
  const newId = tasks.length + 1;
  const newTask: Task = {
    ...task,
    id: newId,
  };

  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify([...tasks, newTask]));
  return newTask;
}

export async function deleteTask(taskId: number): Promise<void> {
  const tasks = await getTasks();
  const tasksFiltered = tasks.filter((task) => task.id !== taskId);

  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasksFiltered));
}

export async function toggleTask(taskId: number): Promise<Task | undefined> {
  const tasks = await getTasks();
  const task = tasks.find((storedTask) => storedTask.id === taskId);

  if (!task) {
    return undefined;
  }

  task.isDone = !task.isDone;
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  return task;
}

export async function updateTask(task: Task): Promise<void> {
  const tasks = await getTasks();
  const updatedTasks = tasks.map((storedTask) => {
    if (storedTask.id === task.id) {
      return task;
    }

    return storedTask;
  });

  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
}
