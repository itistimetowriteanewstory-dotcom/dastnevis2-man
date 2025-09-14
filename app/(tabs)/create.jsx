import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator, } from 'react-native';
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../../constants/colors';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {useAuthStore} from "../../store/authStore";
import { API_URL } from '../../constants/api';

export default function Create() {
  const [title, setTitle] = useState("");           // عنوان (رشته‌ی خالی به عنوان مقدار اولیه)
const [caption, setCaption] = useState("");       // کپشن یا توضیح (رشته‌ی خالی)         // امتیاز (عدد ۳ به عنوان مقدار اولیه)
const [image, setImage] = useState(null);         // تصویر (در ابتدا null)
const [imageBase64, setImageBase64] = useState(null); // نسخه‌ی Base64 تصویر (در ابتدا null)
const [loading, setLoading] = useState(false);    // وضعیت بارگذاری (در ابتدا false)
const [phoneNumber, setPhoneNumber] = useState("");
const [jobtitle, setJobtitle] = useState("");
const [income, setIncome] = useState("");
const [location, setLocation] = useState("");





   const router = useRouter();
   const {token} = useAuthStore();
   //console.log(token);

   const pickImage = async () => {
    try {
       if(Platform.OS !== "web") {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if(status !== "granted") {
      Alert.alert("عدم دسترسی", "برای اضافه کردن عکس ابتدا اجازه دسترسی به دوربین را دهید");
      return;
    }
   }
// launch image library
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: "images",
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.3,
  base64: true,
})

if(!result.canceled) {
  
  setImage(result.assets[0].uri)
  // if based64 is provided, use it
  if(result.assets[0].base64){
    setImageBase64(result.assets[0].base64);
  }else{
    // otherwise , convert to base64
    const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri,{
      encoding: FileSystem.EncodingType.Base64,
    });
    setImageBase64(base64);
  }
}

   } catch (error) {
     console.error("خطا: موقع انتخاب عکس", error);
     Alert.alert("خطا", "مشکلی در انتخاب عکس مورد نظر شما وجود دارد");  

    }
   };

   const handleSubmit = async () => {
  // بررسی کامل بودن فیلدها
  if (!title || !caption || !imageBase64) {
    Alert.alert("خطا", "لطفاً همه‌ی خانه هارا پر کنید");
    return;
  }

  try {
    setLoading(true);

    // استخراج نوع فایل از URI یا پیش‌فرض jpeg
    const uriParts = image.split(".");
    const fileExtension = uriParts[uriParts.length - 1];
    const imageType = fileExtension
      ? `image/${fileExtension.toLowerCase()}`
      : "image/jpeg";

    // ساخت داده‌ی تصویر به صورت Data URI
    const imageDataUri = `data:${imageType};base64,${imageBase64}`;

    // ارسال درخواست POST به سرور
    const response = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // اصلاح حروف بزرگ
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        caption,
        image: imageDataUri,
         phoneNumber,
        jobtitle,
        income,
        location,
      }),
    });

    if (!response.ok) {
  const text = await response.text();
  console.error("پاسخ سرور:", text);
  Alert.alert("خطا", "پاسخ نامعتبر از سرور دریافت شد");
  setLoading(false);
  return;
}



    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "مشکلی در ارسال اطلاعات پیش آمد");
    }

    // موفقیت‌آمیز بودن ارسال
    Alert.alert("موفقیت","شغل با موفقیت اضافه شد ");
    setTitle("");
    setCaption("");
    setImage(null);
    setImageBase64(null);
    setPhoneNumber("");
    setJobtitle("");
    setIncome("");
    setLocation("");
    router.push("/");

  } catch (error) {
    console.error("خطا در ارسال پست:", error);
    Alert.alert("خطا", error.message || "ارسال با مشکل مواجه شد");
  } finally {
    setLoading(false);
  }
};




  return (
    <KeyboardAvoidingView style={{ flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>

      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>
          { /* header */}
        <View style={styles.header}>
     <Text style={styles.title}>شغل خود را ثبت کنید</Text>
     <Text style={styles.subtitle}>با معرفی درخواست ها و فرصت های شغلی زمینه‌ای برای حمایت متقابل و پیشرفت جمعی فراهم کنیم.</Text>
      </View>

      <View style={styles.form}>
        { /* book title */}
        <View style={styles.formGroup}>
  <Text style={styles.label}>عنوان شغل</Text>
  <View style={styles.inputContainer}>
  
    <TextInput
      style={styles.input}
      placeholder="مثال: به یک داکتر در شفاخانه ابن سینا نیاز داریم"
      placeholderTextColor={COLORS.placeholderText}
      value={title}
      onChangeText={setTitle}
    />
  </View>
</View>

{ /* image */}
<View style={styles.formGroup}>
  <Text style={styles.label}>یک عکسی مربوط به شغل درخواست شده را اضافه کنید</Text>
  <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
    {image ? (
      <Image source={{ uri: image }} style={styles.previewImage} />
    ) : (
      <View style={styles.placeholderContainer}>
        <Ionicons
          name="image-outline"
          size={40}
          color={COLORS.textSecondary}
        />
        <Text style={styles.placeholderText}>برای اضافه کردن عکس لطفا کلیک کنید</Text>
      </View>
    )}
  </TouchableOpacity>
</View>
{ /* caption */}
<View style={styles.formGroup}>
  <Text style={styles.label}>توضیحات</Text>
  <TextInput
    style={styles.textArea}
    placeholder="توضیحات مربوط به شغل را میتوانید اینجا بنویسید "
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
    placeholder="نمبر تلفون خودرا بنویسید"
    placeholderTextColor={COLORS.placeholderText}
    value={phoneNumber}
    onChangeText={setPhoneNumber}
    keyboardType="numeric"
  />
</View>

{/* job title */}
<View style={styles.formGroup}>
  <Text style={styles.label}>ولایت </Text>
  <TextInput
    style={styles.inputContainer}
    placeholder="ولایت خود را بنویسید"
    placeholderTextColor={COLORS.placeholderText}
    value={location}
    onChangeText={setLocation}
  />
</View>

{/* job title */}
<View style={styles.formGroup}>
  <Text style={styles.label}>حوزه کاری</Text>
  <TextInput
    style={styles.inputContainer}
    placeholder="مثال: آموزشی .اداری .فنی."
    placeholderTextColor={COLORS.placeholderText}
    value={jobtitle}
    onChangeText={setJobtitle}
  />
</View>

{/* income */}
<View style={styles.formGroup}>
  <Text style={styles.label}>معاش</Text>
  <TextInput
    style={styles.inputContainer}
    placeholder="معاشی که برای کار درنظر دارید را بنویسید"
    placeholderTextColor={COLORS.placeholderText}
    value={income}
    onChangeText={setIncome}
    keyboardType="numeric"
  />
</View>



<TouchableOpacity
  style={styles.button}
  onPress={handleSubmit}
  disabled={loading}
>
  {loading ? (
    <ActivityIndicator color={COLORS.white} />
  ) : (
    <>
      <Ionicons
        name="cloud-upload-outline"
        size={20}
        color={COLORS.white}
        style={styles.buttonIcon}
      />
      <Text style={styles.buttonText}>کار خودرا ثبت کنید</Text>
    </>
  )}
</TouchableOpacity>



      </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}