import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Modal, Alert, FlatList } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../colectionColor/colors";
import { formatPublishDate } from "../../lib/utils";
import styles from "../../assets/styles/jobDetails.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { apiFetch } from "../../store/apiClient";
import { styles1 } from "../../assets/styles/modal.style";
import { Dimensions } from "react-native";


export default function PropertyDetails() {
  const { data } = useLocalSearchParams();
  const [visible, setVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const flatListRef = useRef(null);
 const { width } = Dimensions.get("window");


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
   
    {/* اطلاعات کاربر بالای عکس */}
    <View style={styles.userBox}>
      <Image source={{ uri: property.user?.profileImage }} style={styles.avatar} />
      <Text style={styles.username}>{property.user?.username}</Text>
     </View>


 {property.images?.length > 0 ? (
  <TouchableOpacity onPress={() => { setVisible(true); setImageIndex(0); }}>
    <Image source={{ uri: property.images[0] }} style={styles.mainImage} />
  </TouchableOpacity>
) : property.image ? (
  <TouchableOpacity onPress={() => { setVisible(true); setImageIndex(0); }}>
    <Image source={{ uri: property.image }} style={styles.mainImage} />
  </TouchableOpacity>
) : null}



      {/* عنوان */}
   <View style={styles.infoBox}>
      <Text style={styles.title}>{property.title}</Text>
        <View style={styles.separator} />

      {/* اطلاعات اصلی */}
      <View style={styles.details}>
        {property.location && (
          <>
         <View style={styles.infoRow}>
   <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Ionicons name="location-outline" size={20} color={COLORS.primary} />
    <Text style={styles.info}>ولایت</Text>
  </View>
  <Text style={styles.info1}>{property.location}</Text>
</View>

           <View style={styles.separator} />
          </>
        )}

       
     

{property.price && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
        <Text style={styles.info}>قیمت فروش</Text>
      </View>
      <Text style={styles.info1}>{property.price}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}

{property.rentPrice && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
        <Text style={styles.info}>کرایه</Text>
      </View>
      <Text style={styles.info1}>{property.rentPrice}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}

{property.mortgagePrice && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="business-outline" size={20} color={COLORS.primary} />
        <Text style={styles.info}>گرو</Text>
      </View>
      <Text style={styles.info1}>{property.mortgagePrice}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}

{property.area && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="map-outline" size={20} color={COLORS.primary} />
        <Text style={styles.info}>متراژ</Text>
      </View>
      <Text style={styles.info1}>{property.area}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}

   {property.city && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="home-outline" size={20} color={COLORS.primary} />
        <Text style={styles.info}>آدرس</Text>
      </View>
      <Text
    style={[styles.info1, { flexWrap: "wrap" }]}
   >
  {property.city}
</Text>

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

{/* {property.city && (
  <>
  <View style={styles.separator} />

<View style={styles.addressHeader}>
  <Text style={styles.sectionTitle}>آدرس</Text>
</View>

<Text style={styles.addressText}>
  {property.city}
</Text>
  </>
)}  */}


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
      data={(property.images?.length > 0 
        ? property.images 
        : property.image 
        ? [property.image] 
        : []
      ).reverse()}
      horizontal
      inverted
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
        {imageIndex + 1} / {property.images?.length || 1}
      </Text>
    </View>
  </View>
</Modal>


      <SafeAreaView edges={["bottom"]} style={{ paddingBottom: 80 }} />
    </ScrollView>


  );
}

