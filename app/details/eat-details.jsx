import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Alert, Modal, FlatList, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import styles from '../../assets/styles/jobDetails.styles'; // می‌تونی یه فایل جدید بسازی مثل eatDetails.styles
import { formatPublishDate } from '../../lib/utils';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../colectionColor/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../store/apiClient";
import { useAuthStore } from "../../store/authStore";
import { styles1 } from '../../assets/styles/modal.style';

export default function EatDetails() {
  const { data, user } = useLocalSearchParams();
   const [visible, setVisible] = useState(false);
   const [imageIndex, setImageIndex] = useState(0);
   const flatListRef = useRef(null);
  const { width } = Dimensions.get("window");
  
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
        body: JSON.stringify({ adId: parsedItem._id, adType: "eat" })
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert("خطا", data.message || "مشکلی پیش آمد");
        return;
      }

      setSaved(true);
      Alert.alert("موفق", "آگهی با موفقیت ذخیره شد");
    } catch (error) {
      console.error("Error saving eat item:", error);
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
    {parsedItem.images?.length > 0 ? (
  <TouchableOpacity onPress={() => { setVisible(true); setImageIndex(0); }}>
    <Image source={{ uri: parsedItem.images[0] }} style={styles.mainImage} />
  </TouchableOpacity>
) : parsedItem.image ? (
  <TouchableOpacity onPress={() => { setVisible(true); setImageIndex(0); }}>
    <Image source={{ uri: parsedItem.image }} style={styles.mainImage} />
  </TouchableOpacity>
) : null}

      <View style={styles.details}>
        <View style={styles.infoBox}>
          <Text style={styles.title}>{parsedItem.title}</Text>
          <View style={styles.separator} />

        {parsedItem.location && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.info}>ولایت</Text>
      </View>
      <Text style={styles.info1}>{parsedItem.location}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}

{parsedItem.price && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="pricetag-outline" size={20} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.info}>قیمت</Text>
      </View>
      <Text style={styles.info1}>{parsedItem.price}</Text>
    </View>
    <View style={styles.separator} />
  </>
)}

{parsedItem.address && (
  <>
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="pin-outline" size={20} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.info}>قیمت</Text>
      </View>
      <Text style={styles.info1}>{parsedItem.address}</Text>
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
            style={[styles.saveButton1, saved && { backgroundColor: "white" }]}
          >
            <Text style={styles.saveButtonText1}>
              {saved ? "ذخیره شد" : "ذخیره کنید"}
            </Text>
          </TouchableOpacity>
        </View>
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
            data={(parsedItem.images?.length > 0 
              ? parsedItem.images 
              : parsedItem.image 
              ? [parsedItem.image] 
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
              {imageIndex + 1} / {parsedItem.images?.length || 1}
            </Text>
          </View>
        </View>
      </Modal>

      <SafeAreaView edges={["bottom"]} style={{ paddingBottom: 80 }} />
    </ScrollView>
  );
}

