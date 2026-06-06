
import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Alert, Modal, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import styles from '../../assets/styles/jobDetails.styles'; 
import { formatPublishDate } from '../../lib/utils';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../colectionColor/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import { apiFetch } from "../../store/apiClient";


// ✅ گرفتن توکن از استور
import { useAuthStore } from "../../store/authStore";

export default function JobDetails() {
  // گرفتن هر دو پارامتر
  const { data, user } = useLocalSearchParams();
   const [visible, setVisible] = useState(false);
   const [imageIndex, setImageIndex] = useState(0);
   const flatListRef = useRef(null);

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
   useEffect(() => {
    if (visible && flatListRef.current) {
      // وقتی مودال باز شد، اندیس عکس رو صفر کن
      setImageIndex(0);
      // بعد لیست رو به عکس اول ببر
      flatListRef.current.scrollToIndex({ index: 0, animated: false });
    }
  }, [visible]);

  return (
    <ScrollView style={styles.container}>
     
       <View style={styles.userBox}>
  <Image source={{ uri: parsedUser?.profileImage }} style={styles.avatar} />
  <Text style={styles.username}>{parsedUser?.username}</Text>
</View>

      {/* تصویر اصلی */}
    {parsedJob.images?.length > 0 ? (
  <TouchableOpacity onPress={() => { setVisible(true); setImageIndex(0); }}>
    <Image source={{ uri: parsedJob.images[0] }} style={styles.mainImage} />
  </TouchableOpacity>
) : parsedJob.image ? (
  <TouchableOpacity onPress={() => { setVisible(true); setImageIndex(0); }}>
    <Image source={{ uri: parsedJob.image }} style={styles.mainImage} />
  </TouchableOpacity>
) : null}

      <View style={styles.details}>
      

<View style={styles.infoBox}>
  <Text style={styles.title}>{parsedJob.title}</Text>
   <View style={styles.separator} />

   {/* شیوه پرداخت */}
{parsedJob.paymentType && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="card-outline" size={20} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.info}>دسته بندی</Text>
      </View>
      <Text style={styles.info1}>{parsedJob.paymentType}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}


  


{/* ساعت کاری */}
{parsedJob.workingHours && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="time-outline" size={20} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.info}>ساعت کاری</Text>
      </View>
      <Text style={styles.info1}>{parsedJob.workingHours}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}

{/* درآمد */}
{parsedJob.income && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="cash-outline" size={20} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.info}>معاش</Text>
      </View>
      <Text style={styles.info1}>{parsedJob.income}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}



{parsedJob.jobtitle && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="business-outline" size={20} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.info}>محل کار</Text>
      </View>
      <Text style={styles.info1}>{parsedJob.jobtitle}</Text>
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
   <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6,  }}> 
   
 <Text style={styles.saveButtonText}>تماس بگیرید</Text>
  <Ionicons name="call-outline" size={22} color={COLORS.white} style={styles.icon} />

     </View> 
   
  </TouchableOpacity>

  {/* دکمه ذخیره */}
  <TouchableOpacity
    onPress={saveJob}
    style={[styles.saveButton1, saved && { backgroundColor: "white" }]}
  >
    <Text style={styles.saveButtonText1}>
      {saved ? "ذخیره شد" : "ذخیره کنید"}
    </Text>
  </TouchableOpacity>
</View>


      </View>

<Modal visible={visible} transparent={true} onRequestClose={() => setVisible(false)}>
  <View style={{ flex: 1, backgroundColor: "black" }}>
    
    {/* Header: دکمه بستن */}
    <TouchableOpacity
      onPress={() => setVisible(false)}
      style={{
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 10,
        borderRadius: 20,
      }}
    >
      <Text style={{ color: "white", fontSize: 25 }}>✕</Text>
    </TouchableOpacity>

   

    {/* Body: لیست عکس‌ها */}
    <FlatList
     ref={flatListRef}
     data={(parsedJob.images?.length > 0 
     ? parsedJob.images 
     : parsedJob.image 
     ? [parsedJob.image] 
     : []
     )}
      horizontal
      inverted
      pagingEnabled
      initialScrollIndex={imageIndex}
      getItemLayout={(data, index) => ({
        length: Dimensions.get("window").width,
        offset: Dimensions.get("window").width * index,
        index,
      })}
      renderItem={({ item }) => (
        <View style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").height, justifyContent: "center", alignItems: "center" }}>
          <Image
            source={{ uri: item }}
            style={{ width: "100%", height: "80%", contentFit: "contain" }}
          />
        </View>
      )}

        onMomentumScrollEnd={(e) => {
        const newIndex = Math.round(e.nativeEvent.contentOffset.x / Dimensions.get("window").width);
        setImageIndex(newIndex);
  }}
    />

    {/* Footer: شمارنده عکس‌ها */}
    <View style={{ position: "absolute", bottom: 40, left: 0, right: 0, alignItems: "center" }}>
      <Text style={{ color: "white" }}>
        {imageIndex + 1} / {parsedJob.images?.length || 1}
      </Text>
    </View>
  </View>
</Modal>

      <SafeAreaView edges={["bottom"]} style={{paddingBottom: 80}}/>
    </ScrollView>
  );
}


