import { Ionicons } from "@expo/vector-icons";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { AppState, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
  createTaskCalendarEvent,
  isCalendarPermissionGranted,
  requestCalendarPermission,
} from "../services/device-apis/calendar/calendar";
import {
  isContactsPermissionGranted,
  requestContactsPermission,
  selectContactDetails,
} from "../services/device-apis/contacts/contacts";
import {
  isCameraPermissionGranted,
  requestCameraPermission,
  takePhoto,
} from "../services/device-apis/images/camera";
import {
  isGalleryPermissionGranted,
  requestGalleryPermission,
  selectImageFromGallery,
} from "../services/device-apis/images/gallery";
import {
  getCurrentLocationDetails,
  isLocationPermissionGranted,
  requestLocationPermission,
  type LocationDetails,
} from "../services/device-apis/location/location";
import type { ContactDetails } from "../types/contact";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type DeviceServicesProps = {
  onContactSelected: (contact: ContactDetails) => void;
  onImageSelected: (imageUri: string) => void;
  onLocationDetected: (location: LocationDetails) => void;
  onLocationError: (message: string) => void;
  onCalendarDateSelected: (date: Date) => void;
  taskDescription: string;
  taskTitle: string;
};

type PermissionState = {
  calendar: boolean;
  camera: boolean;
  contacts: boolean;
  gallery: boolean;
  location: boolean;
};

type PermissionKey = keyof PermissionState;
type NonImagePermissionKey = Exclude<PermissionKey, "camera" | "gallery">;
type ServiceKey = PermissionKey | "camera" | "gallery";

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

const locationErrorMessage =
  "No se pudo detectar la ubicación. Verificá que el servicio de ubicación esté activo y que el dispositivo tenga una ubicación disponible.";

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

export function DeviceServices({
  onContactSelected,
  onImageSelected,
  onLocationDetected,
  onLocationError,
  onCalendarDateSelected,
  taskDescription,
  taskTitle,
}: DeviceServicesProps) {
  const [hasCheckedDevicePermissions, setHasCheckedDevicePermissions] = useState(false);
  const [permissions, setPermissions] = useState(initialPermissionState);
  const [isImageOptionsVisible, setIsImageOptionsVisible] = useState(false);
  const [isCalendarPickerVisible, setIsCalendarPickerVisible] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isServiceBusy, setIsServiceBusy] = useState<ServiceKey | null>(null);
  const [serviceMessage, setServiceMessage] = useState("");

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

  function handleCalendarPickerDismiss() {
    setIsCalendarPickerVisible(false);
    setIsServiceBusy(null);
  }

  async function handleCalendarDateSelected(selectedDate: Date) {
    setCalendarDate(selectedDate);
    setIsCalendarPickerVisible(false);

    try {
      const createdEvent = await createTaskCalendarEvent(taskTitle, taskDescription, selectedDate);

      onCalendarDateSelected(createdEvent.startDate);
    } catch {
      setServiceMessage("No se pudo crear el evento en el calendario del dispositivo.");
    } finally {
      setIsServiceBusy(null);
    }
  }

  async function handleCameraPermission() {
    closeImageOptions();
    setServiceMessage("");
    setIsServiceBusy("camera");

    try {
      const permissionGranted = await requestCameraPermission();
      await refreshDevicePermissions();

      if (!permissionGranted) {
        setServiceMessage("No se otorgaron permisos para usar la cámara.");
        return;
      }

      const imageUri = await takePhoto();

      if (imageUri) {
        onImageSelected(imageUri);
      } else {
        setServiceMessage("No se tomó ninguna imagen.");
      }
    } catch {
      setServiceMessage("No se pudo abrir la cámara.");
    } finally {
      setIsServiceBusy(null);
    }
  }

  async function handleGalleryPermission() {
    closeImageOptions();
    setServiceMessage("");
    setIsServiceBusy("gallery");

    try {
      const permissionGranted = await requestGalleryPermission();
      await refreshDevicePermissions();

      if (!permissionGranted) {
        setServiceMessage("No se otorgaron permisos para usar la galería.");
        return;
      }

      const imageUri = await selectImageFromGallery();

      if (imageUri) {
        onImageSelected(imageUri);
      } else {
        setServiceMessage("No se seleccionó ninguna imagen.");
      }
    } catch {
      setServiceMessage("No se pudo abrir la galería.");
    } finally {
      setIsServiceBusy(null);
    }
  }

  async function handleServicePermission(permissionKey: NonImagePermissionKey) {
    setServiceMessage("");
    setIsServiceBusy(permissionKey);

    try {
      const permissionGranted = await permissionRequests[permissionKey]();
      await refreshDevicePermissions();

      if (!permissionGranted) {
        if (permissionKey === "location") {
          onLocationError(locationErrorMessage);
        } else {
          setServiceMessage(`No se otorgaron permisos para usar ${permissionLabels[permissionKey]}.`);
        }

        return;
      }

      if (permissionKey === "location") {
        const location = await getCurrentLocationDetails();

        if (location) {
          onLocationDetected(location);
        } else {
          onLocationError(locationErrorMessage);
        }
      } else if (permissionKey === "contacts") {
        const contact = await selectContactDetails();

        if (contact) {
          onContactSelected(contact);
        } else {
          setServiceMessage("No se seleccionó ningún contacto.");
        }
      } else if (permissionKey === "calendar") {
        setCalendarDate(new Date());
        setIsCalendarPickerVisible(true);
      }
    } catch {
      if (permissionKey === "location") {
        onLocationError(locationErrorMessage);
      } else if (permissionKey === "calendar") {
        setServiceMessage("No se pudo crear el evento en el calendario del dispositivo.");
      } else if (permissionKey === "contacts") {
        setServiceMessage("No se pudo abrir la selección de contactos.");
      }
    } finally {
      setIsServiceBusy(null);
    }
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
          disabled={isServiceBusy !== null}
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
              disabled={isServiceBusy !== null}
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
      {serviceMessage ? <Text style={styles.error}>{serviceMessage}</Text> : null}

      {isCalendarPickerVisible ? (
        <DateTimePicker
          accentColor="#208AEF"
          display="default"
          mode="date"
          negativeButton={{ label: "Cancelar" }}
          onDismiss={handleCalendarPickerDismiss}
          onValueChange={(_event, selectedDate) => {
            handleCalendarDateSelected(selectedDate);
          }}
          positiveButton={{ label: "Elegir" }}
          presentation="dialog"
          value={calendarDate}
        />
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
              disabled={isServiceBusy !== null}
              onPress={handleCameraPermission}
              style={styles.modalOption}
            >
              <Ionicons color="#208AEF" name="camera-outline" size={22} />
              <Text style={styles.modalOptionText}>Cámara</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={isServiceBusy !== null}
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
