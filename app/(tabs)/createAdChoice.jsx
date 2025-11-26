import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../colectionColor/colors";

export default function CreateAdChoice() {
  const router = useRouter();


  return (
    <View style={styles.container}>
      <Text style={styles.title}>نوع آگهی خود را انتخاب کنید</Text>

      <View style={styles.iconGrid}>
        {/* شغل */}
        <TouchableOpacity
          style={styles.iconBox}
          onPress={() => router.push("/create/createJobs")}
        >
          <Ionicons name="briefcase-outline" size={40} color={COLORS.primary} />
          <Text style={styles.iconLabel}>ثبت آگهی شغلی</Text>
        </TouchableOpacity>

        {/* ملک */}
        <TouchableOpacity
          style={styles.iconBox}
          onPress={() => router.push("/create/createProperty")}
        >
          <Ionicons name="home-outline" size={40} color={COLORS.primary} />
          <Text style={styles.iconLabel}>ثبت آگهی ملک</Text>
        </TouchableOpacity>

        {/* وسایل نقلیه */}
        <TouchableOpacity
          style={styles.iconBox}
          onPress={() => router.push("/create/createCar")}
        >
          <Ionicons name="car-outline" size={40} color={COLORS.primary} />
          <Text style={styles.iconLabel}>ثبت آگهی وسایل نقلیه</Text>
        </TouchableOpacity>

        {/* خانه و آشپزخانه */}
        <TouchableOpacity
          style={styles.iconBox}
          onPress={() => router.push("/create/createHome")}
        >
          <Ionicons name="cube-outline" size={40} color={COLORS.primary} />
          <Text style={styles.iconLabel}>لوازم خانه و آشپزخانه</Text>
        </TouchableOpacity>

        {/* پوشاک */}
        <TouchableOpacity
          style={styles.iconBox}
          onPress={() => router.push("/create/createCloutes")}
        >
          <Ionicons name="shirt-outline" size={40} color={COLORS.primary} />
          <Text style={styles.iconLabel}>ثبت آگهی پوشاک</Text>
        </TouchableOpacity>

        {/* خوراکی‌ها */}
        <TouchableOpacity
          style={styles.iconBox}
          onPress={() => router.push("/create/createEat")}
        >
          <Ionicons name="fast-food-outline" size={40} color={COLORS.primary} />
          <Text style={styles.iconLabel}>ثبت آگهی خوراک</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  iconBox: {
    width: "30%",
    alignItems: "center",
    marginVertical: 16,
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlign: "center",
  },

});



