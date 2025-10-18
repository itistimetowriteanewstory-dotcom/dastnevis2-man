import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Alert } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";   // 👈 آیکون‌ها
import COLORS from "../colectionColor/colors";
import { formatPublishDate } from "../lib/utils";
import styles from "../assets/styles/jobDetails.styles"; // 👈 همون استایل صفحه شغل
import { SafeAreaView } from "react-native-safe-area-context";


export default function PropertyDetails() {
  const { data } = useLocalSearchParams();
  const property = JSON.parse(data);

  // 👇 تابع باز کردن شماره‌گیر
  const handleCall = (phoneNumber) => {
    if (!phoneNumber) return;

    const url = Platform.OS === "ios" ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;

    Linking.openURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("خطا", "امکان باز کردن شماره‌گیر وجود ندارد");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("خطا در باز کردن شماره‌گیر:", err));
  };

  return (
  
    <ScrollView style={styles.container}>
      {/* هدر: عکس پروفایل و نام کاربر */}
      <View style={styles.header}>
        {property.user?.profileImage && (
          <Image
            source={{ uri: property.user.profileImage }}
            style={styles.avatar}
          />
        )}
        <Text style={styles.username}>
          {property.user?.username || "کاربر ناشناس"}
        </Text>
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
      <Text style={styles.title}>{property.title}</Text>

      

      {/* اطلاعات اصلی */}
      <View style={styles.details}>
        {property.location && (
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            <Text style={styles.info}>  ولایت: {property.location}</Text>
          </View>
        )}

         {/* 👇 شماره تماس با قابلیت کلیک */}
        {property.phoneNumber && (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", marginVertical: 6 }}
            onPress={() => handleCall(property.phoneNumber)}
          >
            <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.info, { color: "blue", marginLeft: 6 }]}>
              شماره تماس: {property.phoneNumber}
            </Text>
          </TouchableOpacity>
        )}

        {property.city && (
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
            <Ionicons name="home-outline" size={20} color={COLORS.primary} />
            <Text style={styles.info}>  منطقه: {property.city}</Text>
          </View>
        )}

        {property.price && (
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
            <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
            <Text style={styles.info}>  قیمت فروش: {property.price} </Text>
          </View>
        )}

        {property.rentPrice && (
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
            <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
            <Text style={styles.info}>  کرایه: {property.rentPrice}</Text>
          </View>
        )}

        {property.mortgagePrice && (
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
            <Ionicons name="business-outline" size={20} color={COLORS.primary} />
            <Text style={styles.info}>  گرو: {property.mortgagePrice}</Text>
          </View>
        )}

         {property.area && (
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
            <Ionicons name="map-outline" size={20} color={COLORS.primary} />
            <Text style={styles.info}>  متراژ: {property.area}</Text>
          </View>
        )}

       

        {property.description && (
          <Text style={styles.caption}>{property.description}</Text>
        )}

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
          <Text style={styles.date}>
            ثبت شده در تاریخ {formatPublishDate(property.createdAt)}
          </Text>
        </View>
      </View>
       <SafeAreaView edges={["bottom"]} style={{paddingBottom: 80}}/>
    </ScrollView>
     
  );
}

