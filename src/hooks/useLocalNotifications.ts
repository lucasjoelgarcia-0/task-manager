import * as Notifications from "expo-notifications";
import { useState } from "react";
import { Platform } from "react-native";

export type PermissionStatus = "idle" | "loading" | "granted" | "denied";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useLocalNotifications() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>("idle");

  async function requestPermission(): Promise<boolean> {
    setPermissionStatus("loading");

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("recordatorios", {
        name: "Recordatorios",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const currentPermission = await Notifications.getPermissionsAsync();
    let status = currentPermission.status;

    if (status !== "granted") {
      const permission = await Notifications.requestPermissionsAsync();
      status = permission.status;
    }

    const granted = status === "granted";
    setPermissionStatus(granted ? "granted" : "denied");
    return granted;
  }

  async function scheduleNotification(todo: string, seconds: number): Promise<string | null> {
    const granted = await requestPermission();

    if (!granted) {
      return null;
    }

    return Notifications.scheduleNotificationAsync({
      content: {
        body: todo,
        data: {
          tipo: "recordatorio",
        },
        title: "Recordatorio de tarea",
      },
      trigger: {
        seconds,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      },
    });
  }

  return {
    permissionStatus,
    requestPermission,
    scheduleNotification,
  };
}
