import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator, Modal} from 'react-native';
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../../colectionColor/colors';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {useAuthStore} from "../../store/authStore";

import RNPickerSelect from 'react-native-picker-select'; 
import { apiFetch } from '../../store/apiClient';

export default function Create() {
  const [title, setTitle] = useState("");           
const [caption, setCaption] = useState("");       
const [image, setImage] = useState(null);         
const [imageBase64, setImageBase64] = useState(null); 
const [loading, setLoading] = useState(false);    
const [phoneNumber, setPhoneNumber] = useState("");
const [jobtitle, setJobtitle] = useState("");
const [income, setIncome] = useState("");
const [location, setLocation] = useState("");
const [workingHours, setWorkingHours] = useState("");
const [paymentType, setPaymentType] = useState("");





   const router = useRouter();
   const {accessToken} = useAuthStore();
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
  if (!title || !caption || !imageBase64 || !phoneNumber || !location || !income || !workingHours || !paymentType) {
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
    const response = await apiFetch("/jobs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`, // اصلاح حروف بزرگ
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
        workingHours,
        paymentType,
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
    setWorkingHours("");
    setPaymentType("");
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
        { /* job title */}
        <View style={styles.formGroup}>
  <Text style={styles.label}>عنوان شغل</Text>
  <View style={styles.inputContainer}>
  
    <TextInput
      style={styles.input}
      placeholder="مثال: به یک داکتر در شفا خانه ابن سینا نیاز داریم"
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
  <Text style={styles.label}>محل کار</Text>
  <TextInput
    style={styles.inputContainer}
    placeholder="مثال: قلعه فتح الله خان, شار نو, دهبوری"
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
  
  />
</View>

<View style={styles.formGroup}>
  <Text style={styles.label}>ساعت کاری</Text>
  <RNPickerSelect
    onValueChange={(value) => setWorkingHours(value)}
    value={workingHours}
    placeholder={{
      label: "ساعت کاری را انتخاب کنید",
      value: null,
    }}
    items={[
      { label: "تمام وقت 12 ساعت", value: "تمام وقت 12 ساعت", color: COLORS.black },
      { label: "پاره وقت 7 ساعت", value: "پاره وقت 7 ساعت", color: COLORS.black },
      { label: "کارآموزی کمتر از 7 ساعت", value: "کار آموزی کمتر از 7 ساعت", color: COLORS.black },
      { label: "توافقی", value: "توافقی", color: COLORS.black },
    ]}
    useNativeAndroidPickerStyle={false}
    style={{
      inputIOS: {
        backgroundColor: COLORS.inputBackground,
        color: COLORS.black,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 8,
      },
      inputAndroid: {
        backgroundColor: COLORS.inputBackground,
        color: COLORS.black,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 8,
      },
      placeholder: {
        color: COLORS.black,
      },
    }}
  />
</View>

<View style={styles.formGroup}>
  <Text style={styles.label}>شیوه پرداخت</Text>
  <RNPickerSelect
    onValueChange={(value) => setPaymentType(value)}
    value={paymentType}
    placeholder={{
      label: "شیوه پرداخت را انتخاب کنید",
      value: null,
    }}
    items={[
      { label: "ماهانه", value: "ماهانه", color: COLORS.black },
      { label: "هفتگی", value: "هفتگی", color: COLORS.black },
      { label: "روزانه", value: "روزانه", color: COLORS.black },
      { label: "پروژه‌ای", value: "پروژه‌ای", color: COLORS.black },
    ]}
    useNativeAndroidPickerStyle={false}
    style={{
      inputIOS: {
        backgroundColor: COLORS.inputBackground,
        color: COLORS.black,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 8,
      },
      inputAndroid: {
        backgroundColor: COLORS.inputBackground,
        color: COLORS.black,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 8,
      },
      placeholder: {
        color: COLORS.black,
      },
    }}
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