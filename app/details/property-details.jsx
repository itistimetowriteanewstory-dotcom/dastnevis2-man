import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Alert } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../colectionColor/colors";
import { formatPublishDate } from "../../lib/utils";
import styles from "../../assets/styles/jobDetails.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { apiFetch } from "../../store/apiClient";

export default function PropertyDetails() {
  const { data } = useLocalSearchParams();

   let property = null;
  try {
    property = JSON.parse(data);
  } catch (e) {
    console.error("خطا در پارس کردن داده:", e);
  }



  const [saved, setSaved] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

   if (!property) {
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

  // 📌 تابع ذخیره ملک
  const saveProperty = async () => {
    try {
      if (!accessToken) {
        Alert.alert("خطا", "ابتدا وارد حساب کاربری شوید");
        return;
      }

      if (saved) {
        Alert.alert("اطلاع", "این ملک قبلاً ذخیره شده");
        return;
      }

      const res = await apiFetch("/saved-ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ adId: property._id, adType: "property" })
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("خطا", data.message || "مشکلی پیش آمد");
        return;
      }

      setSaved(true);
      Alert.alert("موفق", "ملک با موفقیت ذخیره شد");
    } catch (error) {
      console.error("Error saving property:", error);
      Alert.alert("خطا", "مشکلی در ارتباط با سرور پیش آمد");
    }
  };

  return (

    <ScrollView style={styles.container}>
   
    {/* اطلاعات کاربر بالای عکس */}
    <View style={styles.userBox}>
      <Image source={{ uri: property.user?.profileImage }} style={styles.avatar} />
      <Text style={styles.username}>{property.user?.username}</Text>
     </View>


      {/* عکس ملک */}
      {property.image && (
        <Image
          source={{ uri: property.image }}
          style={styles.jobImage}
          contentFit="cover"
        />
      )}

      {/* عنوان */}
   <View style={styles.infoBox}>
      <Text style={styles.title}>{property.title}</Text>
        <View style={styles.separator} />

      {/* اطلاعات اصلی */}
      <View style={styles.details}>
        {property.location && (
          <>
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            <Text style={styles.info}>  ولایت: {property.location}</Text>
          </View>
           <View style={styles.separator} />
          </>
        )}

       
        {property.city && (
           <>
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
            <Ionicons name="home-outline" size={20} color={COLORS.primary} />
            <Text style={styles.info}>  منطقه: {property.city}</Text>
          </View>
           <View style={styles.separator} />
          </>
        )}

        {property.price && (
          <>
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
            <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
            <Text style={styles.info}>  قیمت فروش: {property.price} </Text>
          </View>
            <View style={styles.separator} />
          </>
        )}

        {property.rentPrice && (
          <>
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
            <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
            <Text style={styles.info}>  کرایه: {property.rentPrice}</Text>
          </View>
           <View style={styles.separator} />
          </>
        )}

        {property.mortgagePrice && (
          <>
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
            <Ionicons name="business-outline" size={20} color={COLORS.primary} />
            <Text style={styles.info}>  گرو: {property.mortgagePrice}</Text>
          </View>
           <View style={styles.separator} />
          </>
        )}

        {property.area && (
           <>
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
            <Ionicons name="map-outline" size={20} color={COLORS.primary} />
            <Text style={styles.info}>  متراژ: {property.area}</Text>
          </View>
           <View style={styles.separator} />
          </>
        )}


        {property.description && (
            <>
           <Text style={styles.sectionTitle}>توضیحات</Text>
          <Text style={styles.caption}>{property.description}</Text>
          </>
        )}
         </View>
          </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
          <Text style={styles.date}>
            ثبت شده در تاریخ {formatPublishDate(property.createdAt)}
          </Text>
        </View>

    <View style={styles.buttonRow}>
      {/* دکمه تماس */}
      <TouchableOpacity
       style={styles.saveButton}
       onPress={() => handleCall(property.phoneNumber)}
       >
      <Text style={styles.saveButtonText}>تماس بگیرید</Text>
     </TouchableOpacity>

      {/* دکمه ذخیره */}
     <TouchableOpacity
       onPress={saveProperty}
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

