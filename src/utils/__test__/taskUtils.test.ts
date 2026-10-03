import { hasCompletedTasks } from "../taskUtils";
import { Task } from "../../types/task";

const pendingTask: Task = {
  id: 1,
  title: "Tareas del hogar",
  todo: "Ordenar la casa",
  isDone: false,
  withNotification: false,
  notificationDate: new Date(),
};

describe("hasCompletedTasks", () => {
  it("Retorna falso cuando no hay tareas completadas", () => {
    expect(hasCompletedTasks([pendingTask])).toBe(false);
  });

  it("Retorna verdadero cuando hay tareas completadas", () => {
    const completedTask = { ...pendingTask, isDone: true };

    expect(hasCompletedTasks([completedTask])).toBe(true);
  });
});
