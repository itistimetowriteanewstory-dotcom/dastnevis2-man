import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import styles from '../../assets/styles/jobDetails.styles'; // می‌تونی یه فایل جدید بسازی مثل kitchenDetails.styles
import { formatPublishDate } from '../../lib/utils';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../colectionColor/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { apiFetch } from "../../store/apiClient";
import { useAuthStore } from "../../store/authStore";

export default function KitchenDetails() {
  const { data, user } = useLocalSearchParams();
  const parsedItem = typeof data === 'string' ? JSON.parse(data) : data;
  const parsedUser = user
    ? (typeof user === 'string' ? JSON.parse(user) : user)
    : parsedItem?.user;

  const [saved, setSaved] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleCall = (phoneNumber) => {
    if (!phoneNumber) return;
    const url = Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) => console.error('خطا در باز کردن شماره‌گیر:', err));
  };

  const saveItem = async () => {
    try {
      if (!accessToken) {
        Alert.alert("خطا", "ابتدا وارد حساب کاربری شوید");
        return;
      }

      if (saved) {
        Alert.alert("اطلاع", "این آگهی قبلاً ذخیره شده");
        return;
      }

      const res = await apiFetch("/saved-ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ adId: parsedItem._id, adType: "homeAndKitchen" })
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert("خطا", data.message || "مشکلی پیش آمد");
        return;
      }

      setSaved(true);
      Alert.alert("موفق", "آگهی با موفقیت ذخیره شد");
    } catch (error) {
      console.error("Error saving kitchen item:", error);
      Alert.alert("خطا", "مشکلی در ارتباط با سرور پیش آمد");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userBox}>
        <Image source={{ uri: parsedUser?.profileImage }} style={styles.avatar} />
        <Text style={styles.username}>{parsedUser?.username}</Text>
      </View>

      <Image source={parsedItem.image} style={styles.jobImage} contentFit="cover" />

      <View style={styles.details}>
        <View style={styles.infoBox}>
          <Text style={styles.title}>{parsedItem.title}</Text>
          <View style={styles.separator} />

          {parsedItem.location && (
            <>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.icon} />
                <Text style={styles.info}>ولایت: {parsedItem.location}</Text>
              </View>
              <View style={styles.separator} />
            </>
          )}

          {parsedItem.category && (
  <>
    <View style={styles.infoRow}>
      <Ionicons name="list-outline" size={20} color={COLORS.primary} style={styles.icon} />
      <Text style={styles.info}>دسته‌بندی: {parsedItem.category}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}



          {parsedItem.texture && (
            <>
              <View style={styles.infoRow}>
                <Ionicons name="layers-outline" size={20} color={COLORS.primary} style={styles.icon} />
                <Text style={styles.info}>جنس: {parsedItem.texture}</Text>
              </View>
              <View style={styles.separator} />
            </>
          )}

          {parsedItem.status && (
  <>
    <View style={styles.infoRow}>
      <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} style={styles.icon} />
      <Text style={styles.info}>وضعیت: {parsedItem.status}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}


{parsedItem.model && (
  <>
    <View style={styles.infoRow}>
      <Ionicons name="cube-outline" size={20} color={COLORS.primary} style={styles.icon} />
      <Text style={styles.info}>مدل: {parsedItem.model}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}


          {parsedItem.dimensions && (
            <>
              <View style={styles.infoRow}>
                <Ionicons name="resize-outline" size={20} color={COLORS.primary} style={styles.icon} />
                <Text style={styles.info}>ابعاد: {parsedItem.dimensions}</Text>
              </View>
              <View style={styles.separator} />
            </>
          )}

          {parsedItem.price && (
            <>
              <View style={styles.infoRow}>
                <Ionicons name="pricetag-outline" size={20} color={COLORS.primary} style={styles.icon} />
                <Text style={styles.info}>قیمت: {parsedItem.price}</Text>
              </View>
              <View style={styles.separator} />
            </>
          )}

          {parsedItem.caption && (
            <View style={styles.descriptionBox}>
              <Text style={styles.sectionTitle}>توضیحات</Text>
              <Text style={styles.caption}>{parsedItem.caption}</Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Text style={styles.date}>
            اضافه شده در تاریخ {formatPublishDate(parsedItem.createdAt)}
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleCall(parsedItem.phoneNumber)}
          >
            <Text style={styles.saveButtonText}>تماس بگیرید</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={saveItem}
            style={[styles.saveButton, saved && { backgroundColor: "gray" }]}
          >
            <Text style={styles.saveButtonText}>
              {saved ? "ذخیره شد" : "ذخیره کنید"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <SafeAreaView edges={["bottom"]} style={{ paddingBottom: 80 }} />
    </ScrollView>
  );
}

