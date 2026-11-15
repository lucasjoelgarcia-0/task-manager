import { create } from "zustand";
import {
  deleteTask as deleteTaskStorage,
  getTasks,
  saveTask,
  toggleTask as toggleTaskStorage,
  updateTask as updateTaskStorage,
} from "../services/taskStorage";
import { Task } from "../types/task";

type TaskStore = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;
  loadTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<Task>;
  deleteTask: (taskId: number) => Promise<void>;
  toggleTask: (taskId: number) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
};

let loadPromise: Promise<void> | null = null;

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  hasLoaded: false,

  loadTasks: async () => {
    if (get().hasLoaded) {
      return;
    }

    if (loadPromise) {
      return loadPromise;
    }

    loadPromise = (async () => {
      set({ error: null, isLoading: true });

      try {
        const tasks = await getTasks();
        set({ hasLoaded: true, tasks });
      } catch (error) {
        set({ error: getErrorMessage(error, "No se pudieron cargar las tareas.") });
        throw error;
      } finally {
        set({ isLoading: false });
        loadPromise = null;
      }
    })();

    return loadPromise;
  },

  addTask: async (task) => {
    set({ error: null });

    try {
      const newTask = await saveTask(task);
      set((state) => ({ tasks: [...state.tasks, newTask] }));
      return newTask;
    } catch (error) {
      set({ error: getErrorMessage(error, "No se pudo guardar la tarea.") });
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    set({ error: null });

    try {
      await deleteTaskStorage(taskId);
      set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) }));
    } catch (error) {
      set({ error: getErrorMessage(error, "No se pudo eliminar la tarea.") });
      throw error;
    }
  },

  toggleTask: async (taskId) => {
    set({ error: null });

    try {
      const updatedTask = await toggleTaskStorage(taskId);

      if (updatedTask) {
        set((state) => ({
          tasks: state.tasks.map((task) => task.id === taskId ? updatedTask : task),
        }));
      }
    } catch (error) {
      set({ error: getErrorMessage(error, "No se pudo actualizar la tarea.") });
      throw error;
    }
  },

  updateTask: async (task) => {
    set({ error: null });

    try {
      await updateTaskStorage(task);
      set((state) => ({
        tasks: state.tasks.map((storedTask) => storedTask.id === task.id ? task : storedTask),
      }));
    } catch (error) {
      set({ error: getErrorMessage(error, "No se pudo actualizar la tarea.") });
      throw error;
    }
  },
}));
