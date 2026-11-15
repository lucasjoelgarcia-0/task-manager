import { render, waitFor } from "@testing-library/react-native";
import { DeviceServices } from "../DeviceServices";
import {
  isCalendarPermissionGranted,
} from "../../services/device-apis/calendar/calendar";
import {
  isContactsPermissionGranted,
} from "../../services/device-apis/contacts/contacts";
import {
  isCameraPermissionGranted,
} from "../../services/device-apis/images/camera";
import {
  isGalleryPermissionGranted,
} from "../../services/device-apis/images/gallery";
import {
  isLocationPermissionGranted,
} from "../../services/device-apis/location/location";

jest.mock("@expo/ui/community/datetime-picker", () => ({
  DateTimePicker: () => null,
}));

jest.mock("../../services/device-apis/calendar/calendar", () => ({
  createTaskCalendarEvent: jest.fn(),
  isCalendarPermissionGranted: jest.fn(),
  requestCalendarPermission: jest.fn(),
}));

jest.mock("../../services/device-apis/contacts/contacts", () => ({
  isContactsPermissionGranted: jest.fn(),
  requestContactsPermission: jest.fn(),
  selectContactDetails: jest.fn(),
}));

jest.mock("../../services/device-apis/images/camera", () => ({
  isCameraPermissionGranted: jest.fn(),
  requestCameraPermission: jest.fn(),
  takePhoto: jest.fn(),
}));

jest.mock("../../services/device-apis/images/gallery", () => ({
  isGalleryPermissionGranted: jest.fn(),
  requestGalleryPermission: jest.fn(),
  selectImageFromGallery: jest.fn(),
}));

jest.mock("../../services/device-apis/location/location", () => ({
  getCurrentLocationDetails: jest.fn(),
  isLocationPermissionGranted: jest.fn(),
  requestLocationPermission: jest.fn(),
}));

const mockedCalendarPermission = jest.mocked(isCalendarPermissionGranted);
const mockedCameraPermission = jest.mocked(isCameraPermissionGranted);
const mockedContactsPermission = jest.mocked(isContactsPermissionGranted);
const mockedGalleryPermission = jest.mocked(isGalleryPermissionGranted);
const mockedLocationPermission = jest.mocked(isLocationPermissionGranted);

const defaultProps = {
  onCalendarDateSelected: jest.fn(),
  onContactSelected: jest.fn(),
  onImageSelected: jest.fn(),
  onLocationDetected: jest.fn(),
  onLocationError: jest.fn(),
  taskDescription: "Ordenar la casa",
  taskTitle: "Tareas del hogar",
};

function setPermissions({
  calendar,
  camera,
  contacts,
  gallery,
  location,
}: {
  calendar: boolean;
  camera: boolean;
  contacts: boolean;
  gallery: boolean;
  location: boolean;
}) {
  mockedCalendarPermission.mockResolvedValue(calendar);
  mockedCameraPermission.mockResolvedValue(camera);
  mockedContactsPermission.mockResolvedValue(contacts);
  mockedGalleryPermission.mockResolvedValue(gallery);
  mockedLocationPermission.mockResolvedValue(location);
}

describe("DeviceServices - mensaje de permisos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("muestra todos los permisos rechazados cuando ninguno fue aceptado", async () => {
    setPermissions({
      calendar: false,
      camera: false,
      contacts: false,
      gallery: false,
      location: false,
    });

    const result = await render(<DeviceServices {...defaultProps} />);

    await waitFor(() => {
      expect(
        result.getByText(
          "Los siguientes permisos no fueron otorgados. Algunas funcionalidades de la aplicación podrían no estar disponibles: calendario, cámara, contactos, galería, ubicación.",
        ),
      ).toBeTruthy();
    });
  });

  it("muestra solamente los permisos rechazados cuando algunos fueron aceptados", async () => {
    setPermissions({
      calendar: true,
      camera: false,
      contacts: true,
      gallery: false,
      location: true,
    });

    const result = await render(<DeviceServices {...defaultProps} />);

    await waitFor(() => {
      expect(
        result.getByText(
          "Los siguientes permisos no fueron otorgados. Algunas funcionalidades de la aplicación podrían no estar disponibles: cámara, galería.",
        ),
      ).toBeTruthy();
    });
  });

  it("no muestra el cartel cuando todos los permisos fueron aceptados", async () => {
    setPermissions({
      calendar: true,
      camera: true,
      contacts: true,
      gallery: true,
      location: true,
    });

    const result = await render(<DeviceServices {...defaultProps} />);

    await waitFor(() => {
      expect(result.queryByText(/Los siguientes permisos no fueron otorgados/)).toBeNull();
    });
  });
});
