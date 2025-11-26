import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Alert } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../colectionColor/colors";
import { formatPublishDate } from "../../lib/utils";
import styles from "../../assets/styles/jobDetails.styles"; // می‌تونی استایل جدا بسازی
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { apiFetch } from "../../store/apiClient";

export default function CarDetails() {
  const { data } = useLocalSearchParams();

  let car = null;
  try {
    car = JSON.parse(data);
  } catch (e) {
    console.error("خطا در پارس کردن داده:", e);
  }

  const [saved, setSaved] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!car) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>اطلاعاتی برای نمایش وجود ندارد</Text>
      </View>
    );
  }

  // 👇 تابع باز کردن شماره‌گیر
  const handleCall = (phoneNumber) => {
    if (!phoneNumber) return;
    const url = Platform.OS === "ios" ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) => console.error("خطا در باز کردن شماره‌گیر:", err));
  };

  // 📌 تابع ذخیره خودرو
  const saveCar = async () => {
    try {
      if (!accessToken) {
        Alert.alert("خطا", "ابتدا وارد حساب کاربری شوید");
        return;
      }

      if (saved) {
        Alert.alert("اطلاع", "این خودرو قبلاً ذخیره شده");
        return;
      }

      const res = await apiFetch("/saved-ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ adId: car._id, adType: "car" })
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("خطا", data.message || "مشکلی پیش آمد");
        return;
      }

      setSaved(true);
      Alert.alert("موفق", "خودرو با موفقیت ذخیره شد");
    } catch (error) {
      console.error("Error saving car:", error);
      Alert.alert("خطا", "مشکلی در ارتباط با سرور پیش آمد");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* اطلاعات کاربر */}
      <View style={styles.userBox}>
        <Image source={{ uri: car.user?.profileImage }} style={styles.avatar} />
        <Text style={styles.username}>{car.user?.username}</Text>
      </View>

      {/* عکس خودرو */}
      {car.image && (
        <Image source={{ uri: car.image }} style={styles.jobImage} contentFit="cover" />
      )}

      {/* عنوان */}
      <View style={styles.infoBox}>
        <Text style={styles.title}>{car.title}</Text>
        <View style={styles.separator} />

        {/* اطلاعات اصلی */}
        <View style={styles.details}>


          {car.adType && (
  <>
    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
      <Ionicons name="albums-outline" size={20} color={COLORS.primary} />
      <Text style={styles.info}>نوع آگهی: {car.adType}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}


         

          {car.brand && (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                <Ionicons name="car-outline" size={20} color={COLORS.primary} />
                <Text style={styles.info}>برند: {car.brand}</Text>
              </View>
              <View style={styles.separator} />
            </>
          )}

          {car.model && (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                <Ionicons name="pricetag-outline" size={20} color={COLORS.primary} />
                <Text style={styles.info}>مدل: {car.model}</Text>
              </View>
              <View style={styles.separator} />
            </>
          )}

          {car.fuelType && (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                <Ionicons name="flame-outline" size={20} color={COLORS.primary} />
                <Text style={styles.info}>نوع سوخت: {car.fuelType}</Text>
              </View>
              <View style={styles.separator} />
            </>
          )}

          {car.price && (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
                <Text style={styles.info}>قیمت: {car.price}</Text>
              </View>
              <View style={styles.separator} />
            </>
          )}

          {car.carcard && (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                <Ionicons name="card-outline" size={20} color={COLORS.primary} />
                <Text style={styles.info}>منطقه: {car.carcard}</Text>
              </View>
              <View style={styles.separator} />
            </>
          )}

          {car.caption && (
            <>
              <Text style={styles.sectionTitle}>توضیحات</Text>
              <Text style={styles.caption}>{car.caption}</Text>
            </>
          )}
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
        <Text style={styles.date}>
          ثبت شده در تاریخ {formatPublishDate(car.createdAt)}
        </Text>
      </View>

      {/* دکمه‌ها */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveButton} onPress={() => handleCall(car.phoneNumber)}>
          <Text style={styles.saveButtonText}>تماس بگیرید</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={saveCar}
          style={[styles.saveButton, saved && { backgroundColor: "gray" }]}
        >
          <Text style={styles.saveButtonText}>
            {saved ? "ذخیره شد" : "ذخیره کنید"}
          </Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView edges={["bottom"]} style={{ paddingBottom: 80 }} />
    </ScrollView>
  );
}

