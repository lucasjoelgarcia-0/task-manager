import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { AppState, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
  isCalendarPermissionGranted,
  requestCalendarPermission,
} from "../services/device-apis/calendar/calendar";
import {
  isContactsPermissionGranted,
  requestContactsPermission,
} from "../services/device-apis/contacts/contacts";
import {
  isCameraPermissionGranted,
  requestCameraPermission,
} from "../services/device-apis/images/camera";
import {
  isGalleryPermissionGranted,
  requestGalleryPermission,
} from "../services/device-apis/images/gallery";
import {
  isLocationPermissionGranted,
  requestLocationPermission,
} from "../services/device-apis/location/location";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type PermissionState = {
  calendar: boolean;
  camera: boolean;
  contacts: boolean;
  gallery: boolean;
  location: boolean;
};

type PermissionKey = keyof PermissionState;
type NonImagePermissionKey = Exclude<PermissionKey, "camera" | "gallery">;

type DeviceService = {
  icon: IoniconName;
  label: string;
  permissionKey: NonImagePermissionKey;
};

const deviceServices: DeviceService[] = [
  { icon: "location-outline", label: "Ubicación", permissionKey: "location" },
  { icon: "person-outline", label: "Contactos", permissionKey: "contacts" },
  { icon: "calendar-outline", label: "Calendario", permissionKey: "calendar" },
];

const initialPermissionState: PermissionState = {
  calendar: false,
  camera: false,
  contacts: false,
  gallery: false,
  location: false,
};

const permissionLabels: Record<PermissionKey, string> = {
  calendar: "calendario",
  camera: "cámara",
  contacts: "contactos",
  gallery: "galería",
  location: "ubicación",
};

const permissionRequests: Record<NonImagePermissionKey, () => Promise<boolean>> = {
  calendar: requestCalendarPermission,
  contacts: requestContactsPermission,
  location: requestLocationPermission,
};

async function checkPermission(check: () => Promise<boolean>): Promise<boolean> {
  try {
    return await check();
  } catch {
    return false;
  }
}

async function checkDevicePermissions(): Promise<PermissionState> {
  const [
    hasCameraPermission,
    hasGalleryPermission,
    hasLocationPermission,
    hasContactsPermission,
    hasCalendarPermission,
  ] = await Promise.all([
    checkPermission(isCameraPermissionGranted),
    checkPermission(isGalleryPermissionGranted),
    checkPermission(isLocationPermissionGranted),
    checkPermission(isContactsPermissionGranted),
    checkPermission(isCalendarPermissionGranted),
  ]);

  return {
    calendar: hasCalendarPermission,
    camera: hasCameraPermission,
    contacts: hasContactsPermission,
    gallery: hasGalleryPermission,
    location: hasLocationPermission,
  };
}

export function DeviceServices() {
  const [hasCheckedDevicePermissions, setHasCheckedDevicePermissions] = useState(false);
  const [permissions, setPermissions] = useState(initialPermissionState);
  const [isImageOptionsVisible, setIsImageOptionsVisible] = useState(false);

  async function refreshDevicePermissions() {
    try {
      setPermissions(await checkDevicePermissions());
    } catch {
      setPermissions(initialPermissionState);
    } finally {
      setHasCheckedDevicePermissions(true);
    }
  }

  useEffect(() => {
    let isMounted = true;

    function checkPermissions() {
      checkDevicePermissions()
        .then((nextPermissions) => {
          if (isMounted) {
            setPermissions(nextPermissions);
          }
        })
        .catch(() => {
          if (isMounted) {
            setPermissions(initialPermissionState);
          }
        })
        .finally(() => {
          if (isMounted) {
            setHasCheckedDevicePermissions(true);
          }
        });
    }

    checkPermissions();
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkPermissions();
      }
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  function closeImageOptions() {
    setIsImageOptionsVisible(false);
  }

  async function handleCameraPermission() {
    closeImageOptions();
    await requestCameraPermission();
    await refreshDevicePermissions();
  }

  async function handleGalleryPermission() {
    closeImageOptions();
    await requestGalleryPermission();
    await refreshDevicePermissions();
  }

  async function handleServicePermission(permissionKey: NonImagePermissionKey) {
    await permissionRequests[permissionKey]();
    await refreshDevicePermissions();
  }

  const deniedPermissions = (Object.keys(permissionLabels) as PermissionKey[])
    .filter((permissionKey) => !permissions[permissionKey])
    .map((permissionKey) => permissionLabels[permissionKey]);
  const permissionError = `Los siguientes permisos no fueron otorgados. Algunas funcionalidades de la aplicación podrían no estar disponibles: ${deniedPermissions.join(", ")}.`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recursos del dispositivo</Text>
      <View style={styles.servicesGrid}>
        <Pressable
          accessibilityLabel="Solicitar imágenes"
          accessibilityRole="button"
          onPress={() => setIsImageOptionsVisible(true)}
          style={({ pressed }) => [
            styles.serviceButton,
            (!permissions.camera || !permissions.gallery) && styles.serviceButtonError,
            pressed && styles.pressedButton,
          ]}
        >
          <Ionicons
            color={permissions.camera && permissions.gallery ? "#208AEF" : "#ffffff"}
            name="images-outline"
            size={28}
          />
          <Text
            style={[
              styles.serviceLabel,
              (!permissions.camera || !permissions.gallery) && styles.serviceLabelError,
            ]}
          >
            Imágenes
          </Text>
        </Pressable>

        {deviceServices.map((service) => {
          const hasPermission = permissions[service.permissionKey];

          return (
            <Pressable
              accessibilityLabel={`Solicitar ${service.label.toLowerCase()}`}
              accessibilityRole="button"
              key={service.label}
              onPress={() => handleServicePermission(service.permissionKey)}
              style={({ pressed }) => [
                styles.serviceButton,
                !hasPermission && styles.serviceButtonError,
                pressed && styles.pressedButton,
              ]}
            >
              <Ionicons
                color={hasPermission ? "#208AEF" : "#ffffff"}
                name={service.icon}
                size={28}
              />
              <Text style={[styles.serviceLabel, !hasPermission && styles.serviceLabelError]}>
                {service.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {hasCheckedDevicePermissions && deniedPermissions.length > 0 ? (
        <Text style={styles.error}>{permissionError}</Text>
      ) : null}

      <Modal
        animationType="fade"
        onRequestClose={closeImageOptions}
        transparent
        visible={isImageOptionsVisible}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿De dónde querés obtener la imagen?</Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleCameraPermission}
              style={styles.modalOption}
            >
              <Ionicons color="#208AEF" name="camera-outline" size={22} />
              <Text style={styles.modalOptionText}>Cámara</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleGalleryPermission}
              style={styles.modalOption}
            >
              <Ionicons color="#208AEF" name="images-outline" size={22} />
              <Text style={styles.modalOptionText}>Galería</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    width: "100%",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  modalOption: {
    alignItems: "center",
    borderColor: "#d9dee5",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    padding: 13,
  },
  modalOptionText: {
    color: "#17202a",
    fontSize: 16,
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  modalTitle: {
    color: "#17202a",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  pressedButton: {
    opacity: 0.75,
  },
  error: {
    color: "#c0392b",
    fontSize: 13,
    marginTop: 8,
  },
  serviceButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d9dee5",
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 96,
    padding: 12,
    width: "48%",
  },
  serviceLabel: {
    color: "#273142",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  serviceLabelError: {
    color: "#ffffff",
  },
  serviceButtonError: {
    backgroundColor: "#c0392b",
    borderColor: "#a93226",
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
    marginTop: 10,
  },
  title: {
    color: "#273142",
    fontSize: 15,
    fontWeight: "600",
  },
});
