import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../colectionColor/colors";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function IconsSection() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>دسته‌بندی آگهی‌ها</Text>

      {/* دکمه باز کردن نیم‌صفحه */}
      <TouchableOpacity
        style={styles.iconBox}
        onPress={() => setVisible(true)}
      >
        <Ionicons name="grid-outline" size={40} color={COLORS.primary} />
        <Text style={styles.iconLabel}>دسته‌بندی‌ها</Text>
      </TouchableOpacity>

      {/* نیم‌صفحه (Modal) */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>دسته‌بندی آگهی‌ها</Text>

            {/* املاک */}
            <TouchableOpacity
              style={styles.iconBox}
              onPress={() => router.push("/page/properties")}
            >
              <Ionicons name="home-outline" size={40} color={COLORS.primary} />
              <Text style={styles.iconLabel}>املاک</Text>
            </TouchableOpacity>

            {/* وسایل نقلیه */}
            <TouchableOpacity
              style={styles.iconBox}
              onPress={() => router.push("/page/car")}
            >
              <Ionicons name="car-outline" size={40} color={COLORS.primary} />
              <Text style={styles.iconLabel}>وسایل نقلیه</Text>
            </TouchableOpacity>

            {/* دکمه بستن نیم‌صفحه */}
            <TouchableOpacity
              style={[styles.iconBox, { backgroundColor: COLORS.primary }]}
              onPress={() => setVisible(false)}
            >
              <Text style={{ color: "#fff" }}>بستن</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 30,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 21,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  iconBox: {
    width: "40%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    margin: 10,
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 15,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // نیم‌صفحه پایین باز بشه
    backgroundColor: "rgba(0,0,0,0.5)", // بک‌گراند نیمه‌شفاف
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "50%", // نصف صفحه
    alignItems: "center",
  },
});

