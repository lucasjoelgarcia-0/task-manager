import {
  deleteTask,
  getTasks,
  saveTask,
  toggleTask,
  updateTask,
} from "../../services/taskStorage";
import { Task } from "../../types/task";
import { useTaskStore } from "../taskStore";

jest.mock("../../services/taskStorage", () => ({
  deleteTask: jest.fn(),
  getTasks: jest.fn(),
  saveTask: jest.fn(),
  toggleTask: jest.fn(),
  updateTask: jest.fn(),
}));

const mockedDeleteTask = jest.mocked(deleteTask);
const mockedGetTasks = jest.mocked(getTasks);
const mockedSaveTask = jest.mocked(saveTask);
const mockedToggleTask = jest.mocked(toggleTask);
const mockedUpdateTask = jest.mocked(updateTask);

const firstTask: Task = {
  id: 1,
  title: "Tareas del hogar",
  todo: "Ordenar la casa",
  completionDate: new Date("2026-11-20T00:00:00.000Z"),
  isDone: false,
  withNotification: false,
  notificationDate: new Date("2026-11-15T00:00:00.000Z"),
};

describe("useTaskStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTaskStore.setState({
      error: null,
      hasLoaded: false,
      isLoading: false,
      tasks: [],
    });
  });

  it("carga las tareas desde la persistencia y evita cargarlas dos veces", async () => {
    mockedGetTasks.mockResolvedValue([firstTask]);

    await useTaskStore.getState().loadTasks();
    await useTaskStore.getState().loadTasks();

    expect(mockedGetTasks).toHaveBeenCalledTimes(1);
    expect(useTaskStore.getState().tasks).toEqual([firstTask]);
    expect(useTaskStore.getState().hasLoaded).toBe(true);
  });

  it("sincroniza alta, toggle, actualización y eliminación con el estado", async () => {
    const newTask = { ...firstTask, id: 2, title: "Otra tarea" };
    const toggledTask = { ...firstTask, isDone: true };
    const updatedTask = { ...firstTask, todo: "Ordenar toda la casa" };
    mockedSaveTask.mockResolvedValue(newTask);
    mockedToggleTask.mockResolvedValue(toggledTask);
    mockedUpdateTask.mockResolvedValue();
    mockedDeleteTask.mockResolvedValue();
    useTaskStore.setState({ tasks: [firstTask], hasLoaded: true });

    await useTaskStore.getState().addTask(newTask);
    await useTaskStore.getState().toggleTask(firstTask.id as number);
    await useTaskStore.getState().updateTask(updatedTask);
    await useTaskStore.getState().deleteTask(newTask.id as number);

    expect(mockedSaveTask).toHaveBeenCalledWith(newTask);
    expect(mockedToggleTask).toHaveBeenCalledWith(firstTask.id);
    expect(mockedUpdateTask).toHaveBeenCalledWith(updatedTask);
    expect(mockedDeleteTask).toHaveBeenCalledWith(newTask.id);
    expect(useTaskStore.getState().tasks).toEqual([updatedTask]);
  });
});
