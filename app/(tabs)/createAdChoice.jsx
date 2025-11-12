import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

export default function CreateAdChoice() {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width; // 👈 گرفتن عرض گوشی

  return (
    <View style={styles.container}>
      {/* عنوان بالای صفحه */}
      <Text style={styles.title}>نوع آگهی خود را انتخاب کنید.</Text>

      {/* دکمه ثبت آگهی شغلی */}
      <TouchableOpacity
        style={[styles.button, { marginHorizontal: 20, alignSelf: "stretch" }]} // 👈 دکمه تمام عرض با کمی فاصله از کناره‌ها
        onPress={() => router.push("/create/createJobs")}
      >
        <Text style={styles.buttonText}>ثبت آگهی شغلی</Text>
      </TouchableOpacity>

      {/* دکمه ثبت آگهی ملک */}
      <TouchableOpacity
        style={[styles.button, { marginHorizontal: 20, alignSelf: "stretch" }]}
        onPress={() => router.push("/create/createProperty")}
      >
        <Text style={styles.buttonText}>ثبت آگهی ملک</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9e6ba", // رنگ پس‌زمینه
    padding: 5,
    alignItems: "center",
    justifyContent: "flex-start", // 👈 عنوان بالا باشه
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 30,
    color: "#573e30ff",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f46a51ff", // رنگ اصلی دکمه
    paddingVertical: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // سایه برای اندروید
    shadowColor: "#000", // سایه برای iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
});



