import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator, Modal } from 'react-native';
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

export default function CreateCar() {
  const [title, setTitle] = useState("");           
  const [caption, setCaption] = useState("");       
  const [images, setImages] = useState([null, null, null, null, null]);
  const [imagesBase64, setImagesBase64] = useState([null, null, null, null, null]);
  const [loading, setLoading] = useState(false);    
  const [phoneNumber, setPhoneNumber] = useState("");
  const [carcard, setCarcard] = useState("");
  const [price, setPrice] = useState("");
  
  const { id } = useLocalSearchParams(); 

  const { createCar1, setCreateCar1 } = useFilterStore();


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
      quality: 0.2,
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

useEffect(() => {
  if (id) {
    const fetchCar = async () => {
      try {
        const response = await apiFetch(`/car/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          console.error("خطا در گرفتن آگهی موتر");
          return;
        }

        const data = await response.json();

        // پر کردن فرم با داده‌های قبلی
        setTitle(data.title || "");
        setCaption(data.caption || "");
        setPhoneNumber(data.phoneNumber || "");
        setCarcard(data.carcard || "");
        setPrice(data.price || "");

      if (data.images && Array.isArray(data.images)) {
      const paddedImages = [...data.images];
      while (paddedImages.length < 5) paddedImages.push(null);
      setImages(paddedImages);
      setImagesBase64([null, null, null, null, null]);
      }



        // اگر فیلترها داری
        setCreateCar1({
          location: data.location || "",
          model: data.model || "",
          brand: data.brand || "",
          fuelType: data.fuelType || "",
          adType: data.adType || "car",
        });
      } catch (error) {
        console.error("خطا در گرفتن اطلاعات آگهی:", error);
      }
    };

    fetchCar();
  }
}, [id]);


  // ارسال فرم
  const handleSubmit = async () => {
     
    if (!title || !caption ||  imagesBase64.every(img => !img) || !phoneNumber || !createCar1.location) {
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
    // عکس جدید انتخاب شده
    const uriParts = uri.split(".");
    const fileExtension = uriParts[uriParts.length - 1];
    const imageType = fileExtension ? `image/${fileExtension.toLowerCase()}` : "image/jpeg";
    imageDataUris.push(`data:${imageType};base64,${base64}`);

   
  } else if (uri && uri.startsWith("http")) {
    // عکس قبلی از سرور
    imageDataUris.push(uri);
  }
}
 

      const response = await apiFetch(id ? `/car/${id}` : "/car", {
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
          carcard,
          price,
          location: createCar1.location,
          model: createCar1.model,
          brand: createCar1.brand,
          fuelType: createCar1.fuelType,
          adType: createCar1.adType,

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

      const data = await response.json();

    Alert.alert("موفقیت", id ? "آگهی موتر با موفقیت ویرایش شد" : "آگهی موتر با موفقیت اضافه شد");
      // پاک کردن فرم
      setTitle("");
      setCaption("");
      setImages([null, null, null, null, null]);
      setImagesBase64([null, null, null, null, null]);
      setPhoneNumber("");
      setCarcard("");
      setPrice("");
      setCreateCar1({
      location: "",
      model: "",
      brand: "",
      fuelType: "",
      adType: "",
      });
      router.push("/page/car");

    } catch (error) {
      console.error("خطا در ارسال پست:", error);
      Alert.alert("خطا", error.message || "ارسال با مشکل مواجه شد");
    } finally {
      setLoading(false);
    }
  };

 


  return (
  <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
      <View style={styles.card}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>وسیله نقلیه خود را ثبت کنید</Text>
          <Text style={styles.subtitle}>
            با معرفی موتر یا وسیله نقلیه خود، امکان خرید و فروش آسان‌تر و سریع‌تر را فراهم کنید.
          </Text>
        </View>

        <View style={styles.form}>
          {/* title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>عنوان آگهی</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="مثال: فروش یک تویوتا کرولا مدل 2015"
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
              placeholder="توضیحات مربوط به وسیله را اینجا بنویسید"
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



          {/* carcard */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>منطقه و آدرس</Text>
            <TextInput
              style={styles.inputContainer}
              placeholder="منطقه و آدرس  خود را بنویسید"
              placeholderTextColor={COLORS.placeholderText}
              value={carcard}
              onChangeText={setCarcard}
            />
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

          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
  {/* location */}
  <TouchableOpacity style={styles.halfBox} onPress={() => router.push({ pathname: "/page/select-location", params: { section: "car" } })}>
    <Text style={{ color: createCar1.location ? COLORS.black : COLORS.placeholderText }}>
      {createCar1.location || "ولایت خود را انتخاب کنید"}
    </Text>
  </TouchableOpacity>


  {/* adType */}
  <TouchableOpacity style={styles.halfBox} onPress={() => router.push({ pathname: "/filter", params: { type: "car1AdType" } })}>
    <Text style={{ color: createCar1.adType ? COLORS.black : COLORS.placeholderText }}>
      {createCar1.adType || "نوع آگهی"}
    </Text>
  </TouchableOpacity>



  {/* model */}
  <TouchableOpacity style={styles.halfBox} onPress={() => router.push({ pathname: "/filter", params: { type: "car1Model" } })}>
    <Text style={{ color: createCar1.model ? COLORS.black : COLORS.placeholderText }}>
      {createCar1.model || "مدل را انتخاب کنید"}
    </Text>
  </TouchableOpacity>


  {/* brand */}
  <TouchableOpacity style={styles.halfBox} onPress={() => router.push({ pathname: "/filter", params: { type: "car1Brand" } })}>
    <Text style={{ color: createCar1.brand ? COLORS.black : COLORS.placeholderText }}>
      {createCar1.brand || "برند را انتخاب کنید"}
    </Text>
  </TouchableOpacity>


  {/* fuelType */}
  <TouchableOpacity style={styles.halfBox} onPress={() => router.push({ pathname: "/filter", params: { type: "car1FuelType" } })}>
    <Text style={{ color: createCar1.fuelType ? COLORS.black : COLORS.placeholderText }}>
      {createCar1.fuelType || "نوع سوخت را انتخاب کنید"}
    </Text>
  </TouchableOpacity>
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
                <Text style={styles.buttonText}>وسیله نقلیه خود را ثبت کنید</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);
}
