import { StyleSheet, Text, View } from "react-native";

type TaskInfoCardProps = {
  title: string;
  value: string;
  secondaryValue?: string;
};

export function TaskInfoCard({ title, value, secondaryValue }: TaskInfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {secondaryValue ? <Text style={styles.secondaryValue}>{secondaryValue}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#d9dee5",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
  },
  secondaryValue: {
    color: "#566171",
    fontSize: 14,
    marginTop: 4,
  },
  title: {
    color: "#273142",
    fontSize: 14,
    fontWeight: "700",
  },
  value: {
    color: "#17202a",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
});
