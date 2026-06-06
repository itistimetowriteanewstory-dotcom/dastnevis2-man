import { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator, Modal} from 'react-native';
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../../colectionColor/colors';
import * as ImagePicker from "expo-image-picker";

import {useAuthStore} from "../../store/authStore";
import { useFilterStore } from "../../store/fileStore";

import { apiFetch } from '../../store/apiClient';
import { useLocalSearchParams } from "expo-router";


export default function Create() {
  const [title, setTitle] = useState("");           
const [caption, setCaption] = useState("");       
 const [images, setImages] = useState([null, null, null, null, null]);
  const [imagesBase64, setImagesBase64] = useState([null, null, null, null, null]);
const [loading, setLoading] = useState(false);    
const [phoneNumber, setPhoneNumber] = useState("");
const [jobtitle, setJobtitle] = useState("");



const { createJobs1,  setCreateJobs1 } = useFilterStore();

const { id } = useLocalSearchParams();


   const router = useRouter();
   const {accessToken} = useAuthStore();
   //console.log(token);

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

        const fetchAdById = async (id) => {
  try {
    const response = await apiFetch(`/jobs/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("خطا در گرفتن آگهی");
    }

    return await response.json();
  } catch (error) {
    console.error("خطا در fetchAdById:", error);
    Alert.alert("خطا", "مشکلی در گرفتن اطلاعات آگهی پیش آمد");
    return null;
  }
};


 const handleSubmit = async () => {
  if (
  !title ||
  !caption ||
  !phoneNumber ||
  !createJobs1.location ||
  !createJobs1.income ||
  !createJobs1.workingHours ||
  !createJobs1.paymentType
) {
  Alert.alert("خطا", "لطفاً همه‌ی خانه‌ها را پر کنید");
  return;
}

  try {
    setLoading(true);

    // آماده‌سازی عکس‌ها
    let imageDataUris = [];

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
        // عکس قبلی از سرور (لینک Cloudinary)
        imageDataUris.push(uri);
      }
    }

    const payload = {
      title,
      caption,
      images: imageDataUris, // ترکیب عکس‌های قبلی + جدید
      phoneNumber,
      jobtitle,
      income: createJobs1.income,
      location: createJobs1.location,
      workingHours: createJobs1.workingHours,
      paymentType: createJobs1.paymentType,
    };

    const url = id ? `/jobs/${id}` : "/jobs";
    const method = id ? "PUT" : "POST";

    const response = await apiFetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("خطا", data.message || "مشکلی پیش آمد");
      return;
    }

    Alert.alert("موفقیت", id ? "آگهی با موفقیت ویرایش شد" : "شغل با موفقیت اضافه شد");

setTitle("");
setCaption("");
setPhoneNumber("");
setJobtitle("");

setImages([null, null, null, null, null]);
setImagesBase64([null, null, null, null, null]);

setCreateJobs1({
  location: "",
  income: "",
  workingHours: "",
  paymentType: "",
});

    router.push("/");

  } catch (error) {
    console.error("خطا در ارسال:", error);
    Alert.alert("خطا", error.message || "ارسال با مشکل مواجه شد");
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  if (id) {
    fetchAdById(id).then(data => {
      if (!data) return;

      setTitle(data.title || "");
      setCaption(data.caption || "");
      setPhoneNumber(data.phoneNumber || "");
      setJobtitle(data.jobtitle || "");

      // همیشه آرایه رو به طول 5 تنظیم کن
      const imgs = data.images || [];
      const paddedImages = [...imgs];
      while (paddedImages.length < 5) {
        paddedImages.push(null);
      }
      setImages(paddedImages);

      // base64 رو خالی بذار چون سرور لینک میده
      setImagesBase64([null, null, null, null, null]);

      setCreateJobs1({
        location: data.location || "",
        income: data.income || "",
        workingHours: data.workingHours || "",
        paymentType: data.paymentType || "",
      });
    });
  }
}, [id]);


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

<Text style={styles.imageHint}>
 افزودن حداقل یک عکس الزامی است پر کردن همه باکس ها اجباری نیست.
</Text>

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
  <Text style={styles.label}>محل کار</Text>
  <TextInput
    style={styles.inputContainer}
    placeholder="مثال: قلعه فتح الله خان, شار نو, دهبوری"
    placeholderTextColor={COLORS.placeholderText}
    value={jobtitle}
    onChangeText={setJobtitle}
  />
</View>

<View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
  {/* location */}
  <TouchableOpacity
    style={styles.halfBox}
    onPress={() =>
      router.push({
        pathname: "/page/select-location",
        params: { section: "createJobs" },
      })
    }
  >
    <Text style={{ color: createJobs1.location ? COLORS.black : COLORS.placeholderText, fontSize: 16 }}>
      {createJobs1.location || "ولایت خود را انتخاب کنید"}
    </Text>
  </TouchableOpacity>

  {/* paymentType */}
  <TouchableOpacity
    style={styles.halfBox}
    onPress={() =>
      router.push({
        pathname: "/filter",
        params: { type: "paymentType" },
      })
    }
  >
    <Text style={{ color: createJobs1.paymentType ? COLORS.black : COLORS.placeholderText }}>
      {createJobs1.paymentType || "یک دسته بندی را انتخاب کنید"}
    </Text>
  </TouchableOpacity>

  {/* income */}
  <TouchableOpacity
    style={styles.halfBox}
    onPress={() =>
      router.push({
        pathname: "/filter",
        params: { type: "income" },
      })
    }
  >
    <Text style={{ color: createJobs1.income ? COLORS.black : COLORS.placeholderText }}>
      {createJobs1.income || "محدوده معاش را انتخاب کنید"}
    </Text>
  </TouchableOpacity>



  {/* workingHours */}
  <TouchableOpacity
    style={styles.halfBox}
    onPress={() =>
      router.push({
        pathname: "/filter",
        params: { type: "workingHours" },
      })
    }
  >
    <Text style={{ color: createJobs1.workingHours ? COLORS.black : COLORS.placeholderText }}>
      {createJobs1.workingHours || "یک ساعت کاری انتخاب کنید"}
    </Text>
  </TouchableOpacity>
</View>



<TouchableOpacity
  style={styles.button}
  onPress={handleSubmit}
  disabled={loading}
>
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
     <Text style={styles.buttonText}>
     {id ? "ویرایش آگهی" : "کار خود را ثبت کنید"}
     </Text>
    </>
  )}
</TouchableOpacity>



      </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}