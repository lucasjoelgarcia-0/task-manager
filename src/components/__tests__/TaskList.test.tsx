import { fireEvent, render } from "@testing-library/react-native";
import { TaskList } from "../TaskList";
import { Task } from "../../types/task";

const pendingTask: Task = {
  id: 1,
  todo: "Ordenar la casa",
  isDone: false,
  withNotification: false,
  notificationDate: new Date(),
};

describe("TaskList", () => {
  it("Renderiza correctamente la lista de tareas", async () => {
    const result = await render(
        <TaskList onDelete={() => {}} onToggle={() => {}} tasks={[pendingTask]} />,
    );

    expect(result.toJSON()).not.toBeNull();
  });

  it("Muestra que hay una lista de tareas pendientes", async () => {
    const result = await render(
      <TaskList onDelete={() => {}} onToggle={() => {}} tasks={[pendingTask]} />,
    );

    const taskText = result.getByText("Ordenar la casa");

    expect(taskText).toBeTruthy();
    expect(taskText).not.toHaveStyle({
      textDecorationLine: "line-through",
    });
    expect(result.getByRole("checkbox").props.accessibilityState).toEqual({
      checked: false,
    });
  });

  it("Muestra que hay tareas finalizadas", async () => {
    const completedTask = { ...pendingTask, isDone: true };
    const result = await render(
      <TaskList onDelete={() => {}} onToggle={() => {}} tasks={[completedTask]} />,
    );

    expect(result.getByText("Ordenar la casa")).toHaveStyle({
      textDecorationLine: "line-through",
    });
    expect(result.getByRole("checkbox").props.accessibilityState).toEqual({
      checked: true,
    });
  });

  it("Ejecuta el la función onToggle cuando se presiona el checkbox de la tarea", async () => {
    const taskId = 1;
    const onToggle = jest.fn();
    const task = { ...pendingTask, id: taskId };
    const result = await render(
      <TaskList onDelete={() => {}} onToggle={onToggle} tasks={[task]} />,
    );

    await fireEvent.press(result.getByRole("checkbox"));

    expect(onToggle).toHaveBeenCalledWith(taskId);
  });

});
