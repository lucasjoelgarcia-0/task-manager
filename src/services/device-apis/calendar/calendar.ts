import * as Calendar from "expo-calendar";

export async function isCalendarPermissionGranted(): Promise<boolean> {
  const permission = await Calendar.getCalendarPermissions(false);

  return permission.granted;
}

export async function requestCalendarPermission(): Promise<boolean> {
  const permission = await Calendar.requestCalendarPermissions(false);

  return permission.granted;
}

export type CreatedTaskCalendarEvent = {
  startDate: Date;
};

export async function createTaskCalendarEvent(
  taskTitle: string,
  taskDescription: string,
  selectedDate: Date,
): Promise<CreatedTaskCalendarEvent> {
  const calendars = await Calendar.getCalendars(Calendar.EntityTypes.EVENT);
  const localCalendar = calendars.find(
    (calendar) =>
      calendar.allowsModifications &&
      (calendar.source?.isLocalAccount === true ||
        calendar.source?.type === Calendar.SourceType.LOCAL ||
        calendar.title === "Task Manager"),
  );
  const writableCalendar =
    localCalendar ??
    calendars.find((calendar) => calendar.allowsModifications) ??
    (await Calendar.createCalendar({
      color: "#208AEF",
      entityType: Calendar.EntityTypes.EVENT,
      source: {
        isLocalAccount: true,
        name: "Task Manager",
        type: Calendar.SourceType.LOCAL,
      },
      title: "Task Manager",
    }));
  const startDate = new Date(selectedDate);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  await writableCalendar.createEvent({
    allDay: true,
    endDate,
    notes: taskTitle.trim() || undefined,
    startDate,
    title: taskDescription.trim() || taskTitle.trim() || "Nueva tarea",
  });

  return {
    startDate,
  };
}
