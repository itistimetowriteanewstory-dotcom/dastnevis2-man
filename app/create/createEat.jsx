import { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../../colectionColor/colors';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAuthStore } from "../../store/authStore";
import { apiFetch } from '../../store/apiClient';
import { useFilterStore } from "../../store/fileStore";

export default function CreateEat() {
  const [title, setTitle] = useState("");            
  const [caption, setCaption] = useState("");        
  const [image, setImage] = useState(null);          
  const [imageBase64, setImageBase64] = useState(null); 
  const [loading, setLoading] = useState(false);    
  const [phoneNumber, setPhoneNumber] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  const { createEat4, setCreateEat4 } = useFilterStore();

  const router = useRouter();
  const { accessToken } = useAuthStore();

  // انتخاب عکس
  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("عدم دسترسی", "برای اضافه کردن عکس ابتدا اجازه دسترسی به گالری را دهید");
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.error("خطا: موقع انتخاب عکس", error);
      Alert.alert("خطا", "مشکلی در انتخاب عکس وجود دارد");
    }
  };

  // ارسال فرم
  const handleSubmit = async () => {
    if (!title || !caption || !imageBase64 || !phoneNumber || !createEat4.location) {
      Alert.alert("خطا", "لطفاً همه‌ی خانه‌های ضروری را پر کنید");
      return;
    }

    try {
      setLoading(true);

      const uriParts = image.split(".");
      const fileExtension = uriParts[uriParts.length - 1];
      const imageType = fileExtension
        ? `image/${fileExtension.toLowerCase()}`
        : "image/jpeg";

      const imageDataUri = `data:${imageType};base64,${imageBase64}`;

      const response = await apiFetch("/eat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          caption,
          image: imageDataUri,
          phoneNumber,
          price,
          location: createEat4.location,
        }),
      });

      if (!response.ok) {
        let errorMessage = "مشکلی پیش آمد";
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          console.error("خطا در خواندن پاسخ:", e);
        }
        Alert.alert("خطا", errorMessage);
        setLoading(false);
        return;
      }

      await response.json();

      Alert.alert("موفقیت", "آگهی خوراکی با موفقیت اضافه شد");
      // پاک کردن فرم
      setTitle("");
      setCaption("");
      setImage(null);
      setImageBase64(null);
      setPhoneNumber("");
      setPrice("");
      setCreateEat4({
       location: "",
       });
      router.push("/page/eat");

    } catch (error) {
      console.error("خطا در ارسال پست:", error);
      Alert.alert("خطا", error.message || "ارسال با مشکل مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  // 👇 بخش UI (return)
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>
          {/* header */}
          <View style={styles.header}>
            <Text style={styles.title}>خوراکی خود را ثبت کنید</Text>
            <Text style={styles.subtitle}>
              با معرفی خوراکی خود، امکان خرید و فروش آسان‌تر و سریع‌تر را فراهم کنید.
            </Text>
          </View>

          <View style={styles.form}>
            {/* title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>عنوان آگهی</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="مثال: فروش یک کیک خانگی"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            {/* image */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>عکس خوراکی</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                    <Text style={styles.placeholderText}>برای اضافه کردن عکس کلیک کنید</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>توضیحات</Text>
              <TextInput
                style={styles.textArea}
                placeholder="توضیحات مربوط به خوراکی را اینجا بنویسید"
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            {/* phone number */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>نمبر تلفون</Text>
              <TextInput
                style={styles.inputContainer}
                placeholder="نمبر تلفون خود را وارد کنید"
                placeholderTextColor={COLORS.placeholderText}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="numeric"
              />
            </View>

             {/* location */}
         <View style={styles.formGroup}>
        <Text style={styles.label}>ولایت</Text>
       <TouchableOpacity
         style={styles.inputContainer}
           onPress={() =>
         router.push({
          pathname: "/page/select-location",
         params: { section: "eat" }, // 👈 مسیر برگشت
          })
       }
     >
      <Text
      style={{
        color: createEat4.location ? COLORS.black : COLORS.placeholderText,
        fontSize: 16,
      }}
    >
      {createEat4.location || "ولایت خود را انتخاب کنید"}
    </Text>
  </TouchableOpacity>
</View>

            {/* price */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>قیمت</Text>
              <TextInput
                style={styles.inputContainer}
                placeholder="قیمت مورد نظر خود را وارد کنید"
                placeholderTextColor={COLORS.placeholderText}
                value={price}
                onChangeText={setPrice}
             
              />
            </View>

            {/* submit button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.black} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.black}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>ثبت آگهی خوراکی</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

