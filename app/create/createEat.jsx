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
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function CreateEat() {
  const [title, setTitle] = useState("");            
  const [caption, setCaption] = useState("");        
  const [images, setImages] = useState([null, null, null, null, null]);
  const [imagesBase64, setImagesBase64] = useState([null, null, null, null, null]);
  const [loading, setLoading] = useState(false);    
  const [phoneNumber, setPhoneNumber] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  

  const { createEat4, setCreateEat4 } = useFilterStore();

  const { id } = useLocalSearchParams();


  const router = useRouter();
  const { accessToken } = useAuthStore();


  const pickImage = async (index) => {
      try {
        if (Platform.OS !== "web") {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("عدم دسترسی", "برای اضافه کردن عکس ابتدا اجازه دسترسی به گالری را دهید");
            return;
          }
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 0.3,
          base64: true,
        });
    
        if (!result.canceled) {
          const uri = result.assets[0].uri;
          const base64 = result.assets[0].base64;
    
          const newImages = [...images];
          const newImagesBase64 = [...imagesBase64];
          newImages[index] = uri;
          newImagesBase64[index] = base64;
    
          setImages(newImages);
          setImagesBase64(newImagesBase64);
        }
      } catch (error) {
        console.error("خطا در انتخاب عکس:", error);
        Alert.alert("خطا", "مشکلی در انتخاب عکس پیش آمد");
      }
    };
  

  const handleSubmit = async () => {
  if (!title || !caption || !phoneNumber || !createEat4.location || !address) {
    Alert.alert("خطا", "لطفاً همه‌ی خانه‌های ضروری را پر کنید");
    return;
  }

  try {
    setLoading(true);

    const imageDataUris = [];
    for (let i = 0; i < images.length; i++) {
      const base64 = imagesBase64[i];
      const uri = images[i];

      if (base64 && uri) {
        const uriParts = uri.split(".");
        const fileExtension = uriParts[uriParts.length - 1];
        const imageType = fileExtension ? `image/${fileExtension.toLowerCase()}` : "image/jpeg";
        imageDataUris.push(`data:${imageType};base64,${base64}`);
      } else if (uri && uri.startsWith("http")) {
        imageDataUris.push(uri); // عکس قبلی
      }
    }

    const response = await apiFetch(id ? `/eat/${id}` : "/eat", {
      method: id ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        caption,
        images: imageDataUris,
        phoneNumber,
        price,
        address,
        location: createEat4.location,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      Alert.alert("خطا", errorData.message || "مشکلی پیش آمد");
      return;
    }

      await response.json();

    Alert.alert("موفقیت", id ? "آگهی مواد غذایی با موفقیت ویرایش شد" : "آگهی مواد غذایی با موفقیت اضافه شد");
      // پاک کردن فرم
      setTitle("");
      setCaption("");
      setImages([null, null, null, null, null]);
      setImagesBase64([null, null, null, null, null]);
      setPhoneNumber("");
      setPrice("");
      setAddress("");
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

  useEffect(() => {
  if (id) {
    const fetchEat = async () => {
      try {
        const response = await apiFetch(`/eat/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          console.error("خطا در گرفتن آگهی مواد غذایی");
          return;
        }

        const data = await response.json();

        // پر کردن فرم با داده‌های قبلی
        setTitle(data.title || "");
        setCaption(data.caption || "");
        setPhoneNumber(data.phoneNumber || "");
        setPrice(data.price || "");
        setAddress(data.address || "");

        // تنظیم تصاویر با طول ثابت ۵
        if (data.images && Array.isArray(data.images)) {
          const paddedImages = [...data.images];
          while (paddedImages.length < 5) paddedImages.push(null);
          setImages(paddedImages);
          setImagesBase64([null, null, null, null, null]);
        }

        // تنظیم فیلترها
        setCreateEat4({
          location: data.location || "",
        });
      } catch (error) {
        console.error("خطا در گرفتن اطلاعات آگهی:", error);
      }
    };

    fetchEat();
  }
}, [id]);


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
            <Text style={styles.title}>مواد غذایی خود را ثبت کنید</Text>
            <Text style={styles.subtitle}>
              با معرفی مواد غذایی خود، امکان خرید و فروش آسان‌تر و سریع‌تر را فراهم کنید.
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

          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
  {images.map((img, index) => (
    <TouchableOpacity
      key={index}
      style={styles.imagePickerBox}
      onPress={() => pickImage(index)}
    >
      {img ? (
        <Image source={{ uri: img }} style={styles.previewImage} />
      ) : (
        <View style={styles.placeholderContainer}>
          <Ionicons name="image-outline" size={30} color={COLORS.textSecondary} />
          <Text style={styles.placeholderText}>انتخاب عکس {index + 1}</Text>
        </View>
      )}
    </TouchableOpacity>
  ))}
</View>

            {/* caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>توضیحات</Text>
              <TextInput
                style={styles.textArea}
                placeholder="توضیحات مربوط به مواد غذایی را اینجا بنویسید"
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

               {/* phone number */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>آدرس و منطقه</Text>
              <TextInput
                style={styles.inputContainer}
                placeholder="آدرس خودرا بنویسید"
                placeholderTextColor={COLORS.placeholderText}
                value={address}
                onChangeText={setAddress}
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
                  <Text style={styles.buttonText}>ثبت آگهی مواد غذایی</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

