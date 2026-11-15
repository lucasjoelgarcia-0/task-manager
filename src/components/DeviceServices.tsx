import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
  isCameraPermissionGranted,
  requestCameraPermission,
} from "../services/device-apis/images/camera";
import {
  isGalleryPermissionGranted,
  requestGalleryPermission,
} from "../services/device-apis/images/gallery";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type DeviceService = {
  icon: IoniconName;
  label: string;
};

const deviceServices: DeviceService[] = [
  { icon: "location-outline", label: "Ubicación" },
  { icon: "person-outline", label: "Contactos" },
  { icon: "calendar-outline", label: "Calendario" },
];

const imagePermissionError = "Permisos no otorgados para usar esta funcionalidad.";

async function checkImagePermissions(): Promise<boolean> {
  const [hasCameraPermission, hasGalleryPermission] = await Promise.all([
    isCameraPermissionGranted(),
    isGalleryPermissionGranted(),
  ]);

  return hasCameraPermission && hasGalleryPermission;
}

export function DeviceServices() {
  const [hasCheckedImagePermissions, setHasCheckedImagePermissions] = useState(false);
  const [hasImagePermissions, setHasImagePermissions] = useState(false);
  const [isImageOptionsVisible, setIsImageOptionsVisible] = useState(false);

  async function refreshImagePermissions() {
    try {
      setHasImagePermissions(await checkImagePermissions());
    } catch {
      setHasImagePermissions(false);
    } finally {
      setHasCheckedImagePermissions(true);
    }
  }

  useEffect(() => {
    let isMounted = true;

    void checkImagePermissions()
      .then((permissionsGranted) => {
        if (isMounted) {
          setHasImagePermissions(permissionsGranted);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasImagePermissions(false);
        }
      })
      .finally(() => {
        if (isMounted) {
          setHasCheckedImagePermissions(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function closeImageOptions() {
    setIsImageOptionsVisible(false);
  }

  async function handleCameraPermission() {
    closeImageOptions();
    await requestCameraPermission();
    await refreshImagePermissions();
  }

  async function handleGalleryPermission() {
    closeImageOptions();
    await requestGalleryPermission();
    await refreshImagePermissions();
  }

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
            !hasImagePermissions && styles.serviceButtonError,
            pressed && styles.pressedButton,
          ]}
        >
          <Ionicons
            color={hasImagePermissions ? "#208AEF" : "#ffffff"}
            name="images-outline"
            size={28}
          />
          <Text style={[styles.serviceLabel, !hasImagePermissions && styles.serviceLabelError]}>
            Imágenes
          </Text>
        </Pressable>

        {deviceServices.map((service) => (
          <Pressable
            accessibilityLabel={`Solicitar ${service.label.toLowerCase()}`}
            accessibilityRole="button"
            key={service.label}
            onPress={() => undefined}
            style={({ pressed }) => [styles.serviceButton, pressed && styles.pressedButton]}
          >
            <Ionicons color="#208AEF" name={service.icon} size={28} />
            <Text style={styles.serviceLabel}>{service.label}</Text>
          </Pressable>
        ))}
      </View>
      {hasCheckedImagePermissions && !hasImagePermissions ? (
        <Text style={styles.error}>{imagePermissionError}</Text>
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
