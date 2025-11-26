
import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import styles from '../../assets/styles/jobDetails.styles'; 
import { formatPublishDate } from '../../lib/utils';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../colectionColor/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { apiFetch } from "../../store/apiClient";


// ✅ گرفتن توکن از استور
import { useAuthStore } from "../../store/authStore";

export default function JobDetails() {
  // گرفتن هر دو پارامتر
  const { data, user } = useLocalSearchParams();

  const parsedJob = typeof data === 'string' ? JSON.parse(data) : data;
  // 👇 اگر user پاس داده نشده باشه، از parsedJob.user استفاده می‌کنیم
  const parsedUser = user 
    ? (typeof user === 'string' ? JSON.parse(user) : user) 
    : parsedJob?.user;

  const [saved, setSaved] = useState(false);
  const  accessToken = useAuthStore((state) => state.accessToken);

  const handleCall = (phoneNumber) => {
    if (!phoneNumber) return;

    const url = Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) => console.error('خطا در باز کردن شماره‌گیر:', err));
  };

  // 📌 فقط ذخیره کردن شغل
  const saveJob = async () => {
    try {
      if (!accessToken) {
        Alert.alert("خطا", "ابتدا وارد حساب کاربری شوید");
        return;
      }

      if (saved) {
        Alert.alert("اطلاع", "این شغل قبلاً ذخیره شده");
        return;
      }

      const res = await apiFetch("/saved-ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ adId: parsedJob._id, adType: "job" })
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("خطا", data.message || "مشکلی پیش آمد");
        return;
      }

      setSaved(true);
      Alert.alert("موفق", "شغل با موفقیت ذخیره شد");
    } catch (error) {
      console.error("Error saving job:", error);
      Alert.alert("خطا", "مشکلی در ارتباط با سرور پیش آمد");
    }
  };

  return (
    <ScrollView style={styles.container}>
     
       <View style={styles.userBox}>
  <Image source={{ uri: parsedUser?.profileImage }} style={styles.avatar} />
  <Text style={styles.username}>{parsedUser?.username}</Text>
</View>

      {/* تصویر اصلی */}
      <Image source={parsedJob.image} style={styles.jobImage} contentFit="cover" />

      <View style={styles.details}>
      

<View style={styles.infoBox}>
  <Text style={styles.title}>{parsedJob.title}</Text>
   <View style={styles.separator} />

  

  {/* محل کار */}
  {parsedJob.jobtitle && (
     <>
    <View style={styles.infoRow}>
      <Ionicons name="business-outline" size={20} color={COLORS.primary} style={styles.icon} />
      <Text style={styles.info}>محل کار : {parsedJob.jobtitle}</Text>
    </View>
     <View style={styles.separator} />
    </>
  )}

   {parsedJob.workingHours && (
    <>
      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={20} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.info}>ساعت کاری: {parsedJob.workingHours}</Text>
      </View>
      <View style={styles.separator} />
    </>
  )}

  {/* درآمد */}
  {parsedJob.income && (
    <>
    <View style={styles.infoRow}>
      <Ionicons name="cash-outline" size={20} color={COLORS.primary} style={styles.icon} />
      <Text style={styles.info}>معاش: {parsedJob.income}</Text>
    </View>
     <View style={styles.separator} />
     </>
  )}

   

  {/* شیوه پرداخت */}
  {parsedJob.paymentType && (
    <>
      <View style={styles.infoRow}>
        <Ionicons name="card-outline" size={20} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.info}>شیوه پرداخت: {parsedJob.paymentType}</Text>
      </View>
      <View style={styles.separator} />
    </>
  )}



  {/* توضیحات */}
  {parsedJob.caption && (
  <View style={styles.descriptionBox}>
         <Text style={styles.sectionTitle}>توضیحات</Text>
      <Text style={styles.caption}>{parsedJob.caption}</Text>
    </View>
  )}

</View>


        {/* تاریخ */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Text style={styles.date}>
            اضافه شده در تاریخ {formatPublishDate(parsedJob.createdAt)}
          </Text>
        </View>

      
<View style={styles.buttonRow}>
  {/* دکمه تماس */}
  <TouchableOpacity
    style={styles.saveButton}
    onPress={() => handleCall(parsedJob.phoneNumber)}
  >
    <Text style={styles.saveButtonText}>تماس بگیرید</Text>
  </TouchableOpacity>

  {/* دکمه ذخیره */}
  <TouchableOpacity
    onPress={saveJob}
    style={[styles.saveButton, saved && { backgroundColor: "gray" }]}
  >
    <Text style={styles.saveButtonText}>
      {saved ? "ذخیره شد" : "ذخیره کنید"}
    </Text>
  </TouchableOpacity>
</View>


      </View>
      <SafeAreaView edges={["bottom"]} style={{paddingBottom: 80}}/>
    </ScrollView>
  );
}


