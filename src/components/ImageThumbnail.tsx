import { Image, StyleSheet, View } from "react-native";

type ImageThumbnailProps = {
  size?: number;
  uri?: string | null;
};

export function ImageThumbnail({ size = 112, uri }: ImageThumbnailProps) {
  if (!uri) {
    return null;
  }

  return (
    <View style={[styles.container, { height: size, width: size }]}>
      <Image
        accessibilityLabel="Imagen asociada a la tarea"
        resizeMode="cover"
        source={{ uri }}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    borderColor: "#d9dee5",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
