import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Alert, FlatList, Modal, Dimensions} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../colectionColor/colors";
import { formatPublishDate } from "../../lib/utils";
import styles from "../../assets/styles/jobDetails.styles"; // می‌تونی استایل جدا بسازی
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { apiFetch } from "../../store/apiClient";
import { styles1 } from "../../assets/styles/modal.style";

export default function CarDetails() {
  const { data } = useLocalSearchParams();
  const [visible, setVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const flatListRef = useRef(null);
  const { width } = Dimensions.get("window");

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

  // 📌 تابع ذخیره موتر
  const saveCar = async () => {
    try {
      if (!accessToken) {
        Alert.alert("خطا", "ابتدا وارد حساب کاربری شوید");
        return;
      }

      if (saved) {
        Alert.alert("اطلاع", "این موتر قبلاً ذخیره شده");
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
      Alert.alert("موفق", "موتر با موفقیت ذخیره شد");
    } catch (error) {
      console.error("Error saving car:", error);
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
      {/* اطلاعات کاربر */}
      <View style={styles.userBox}>
        <Image source={{ uri: car.user?.profileImage }} style={styles.avatar} />
        <Text style={styles.username}>{car.user?.username}</Text>
      </View>

       {/* تصویر اصلی */}
    {car.images?.length > 0 ? (
  <TouchableOpacity onPress={() => { setVisible(true); setImageIndex(0); }}>
    <Image source={{ uri: car.images[0] }} style={styles.mainImage} />
  </TouchableOpacity>
) : car.image ? (
  <TouchableOpacity onPress={() => { setVisible(true); setImageIndex(0); }}>
    <Image source={{ uri: car.image }} style={styles.mainImage} />
  </TouchableOpacity>
) : null}

      {/* عنوان */}
      <View style={styles.infoBox}>
        <Text style={styles.title}>{car.title}</Text>
        <View style={styles.separator} />

        {/* اطلاعات اصلی */}
        <View style={styles.details}>


         {car.adType && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="albums-outline" size={20} color={COLORS.primary} />
        <Text style={styles.info}>نوع آگهی</Text>
      </View>
      <Text style={styles.info1}>{car.adType}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}


{car.brand && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="car-outline" size={20} color={COLORS.primary} />
        <Text style={styles.info}>برند</Text>
      </View>
      <Text style={styles.info1}>{car.brand}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}

{car.model && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="pricetag-outline" size={20} color={COLORS.primary} />
        <Text style={styles.info}>مدل</Text>
      </View>
      <Text style={styles.info1}>{car.model}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}

{car.fuelType && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="flame-outline" size={20} color={COLORS.primary} />
        <Text style={styles.info}>نوع سوخت</Text>
      </View>
      <Text style={styles.info1}>{car.fuelType}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}

{car.price && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
        <Text style={styles.info}>قیمت</Text>
      </View>
      <Text style={styles.info1}>{car.price}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}

{car.carcard && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="card-outline" size={20} color={COLORS.primary} />
        <Text style={styles.info}>آدرس</Text>
      </View>
      <Text  style={[styles.info1, {flexWrap: 'wrap'}]}>{car.carcard}</Text>
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
          style={[styles.saveButton1, saved && { backgroundColor: "white" }]}
        >
          <Text style={styles.saveButtonText1}>
            {saved ? "ذخیره شد" : "ذخیره کنید"}
          </Text>
        </TouchableOpacity>
      </View>

    
            <Modal visible={visible} transparent={true} onRequestClose={() => setVisible(false)}>
                   <View style={styles1.container}>
                     
                     {/* Header: دکمه بستن */}
                     <TouchableOpacity onPress={() => setVisible(false)} style={styles1.closeButton}>
                       <Text style={styles1.closeButtonText}>✕</Text>
                     </TouchableOpacity>
                 
                     {/* Body: لیست عکس‌ها */}
                     <FlatList
                       ref={flatListRef}
                       data={(car.images?.length > 0 
                         ? car.images 
                         : car.image 
                         ? [car.image] 
                         : []
                       )}
                       horizontal
                       pagingEnabled
                       initialScrollIndex={imageIndex}
                       getItemLayout={(data, index) => ({
                         length: width,
                         offset: width * index,
                         index,
                       })}
                       renderItem={({ item }) => (
                         <View style={styles1.imageWrapper}>
                           <Image source={{ uri: item }} style={styles1.image} />
                         </View>
                       )}
                       onMomentumScrollEnd={(e) => {
                         const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                         setImageIndex(newIndex);
                       }}
                     />
                 
                     {/* Footer: شمارنده عکس‌ها */}
                     <View style={styles1.footer}>
                       <Text style={styles1.footerText}>
                         {imageIndex + 1} / {car.images?.length || 1}
                       </Text>
                     </View>
                   </View>
                 </Modal>

      <SafeAreaView edges={["bottom"]} style={{ paddingBottom: 80 }} />
    </ScrollView>
  );
}

