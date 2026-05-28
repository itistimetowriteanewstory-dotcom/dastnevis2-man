import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import COLORS from "../../colectionColor/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { View, Modal, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native";


export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          headerTitleStyle: {
            color: COLORS.textPrimary,
            fontWeight: "600",
          },
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: COLORS.cardBackground,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            paddingTop: 5,
            paddingBottom: insets.bottom,
            height: 60 + insets.bottom,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "شغل ها",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="briefcase-outline" size={size} color={color} />
            ),
          }}
        />

        {/* تب دسته‌بندی‌ها بدون صفحه */}
        <Tabs.Screen
          name="iconSection"
          options={{
            title: "دسته‌بندی‌ها",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={() => setVisible(true)} />
            ),
          }}
        />

        <Tabs.Screen
          name="createAdChoice"
          options={{
            title: "ثیت آگهی",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "صفحه کاربر",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* مودال نیم‌صفحه */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
     <TouchableWithoutFeedback onPress={() => setVisible(false)}>
    <View style={styles.modalContainer}>
      
      {/* جلوگیری از بسته شدن مودال هنگام لمس داخل محتوا */}
      <TouchableWithoutFeedback>
        <View style={styles.modalContent}>



             {/* دکمه بستن بالای مودال */}
      <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
        <Ionicons name="close-outline" size={36} color={COLORS.primary} />
      </TouchableOpacity>


            <Text style={styles.title}>دسته‌بندی آگهی‌ها</Text>
             {/* ردیف اول - سه آیکون */}
  <View style={styles.row}>
    <TouchableOpacity style={styles.iconBox} onPress={() => router.push("/page/properties")}>
      <Ionicons name="home-outline" size={40} color={COLORS.primary} />
      <Text style={styles.iconLabel}>املاک</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.iconBox} onPress={() => router.push("/page/car")}>
      <Ionicons name="car-outline" size={40} color={COLORS.primary} />
      <Text style={styles.iconLabel}>وسایل نقلیه</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.iconBox} onPress={() => router.push("/page/cloutes")}>
      <Ionicons name="shirt-outline" size={40} color={COLORS.primary} />
      <Text style={styles.iconLabel}>پوشاک</Text>
    </TouchableOpacity>
  </View>

  {/* ردیف دوم - دو آیکون */}
  <View style={styles.row}>
    <TouchableOpacity style={styles.iconBox} onPress={() => router.push("/page/kitchen")}>
      <Ionicons name="cube-outline" size={40} color={COLORS.primary} />
      <Text style={styles.iconLabel}>خانه و آشپزخانه</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.iconBox} onPress={() => router.push("/page/eat")}>
      <Ionicons name="fast-food-outline" size={40} color={COLORS.primary} />
      <Text style={styles.iconLabel}>مواد غذایی‌ها</Text>
    </TouchableOpacity>
  </View>

         
          </View>
           </TouchableWithoutFeedback>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "50%",
    alignItems: "center",
  },

  row: {
  flexDirection: "row",
  justifyContent:  "space-evenly", // وسط چین
  marginVertical: 10,
},

  title: {
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 20,
  },
 iconBox: {
  width: 90,               // هر آیکون فضای مساوی بگیره
  alignItems: "center",
  justifyContent: "center",
  marginHorizontal: 8,
  height: 90,
},
closeButton: {
  position: "absolute",
  top: 10,
  left: 10,
  padding: 5,
  zIndex: 10,
},

  iconLabel: {
    marginTop: 8,
    fontSize: 15,
    textAlign: "center",
  },
});

