import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../../colectionColor/colors';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAuthStore } from "../../store/authStore";
import { useFilterStore } from "../../store/fileStore";
import RNPickerSelect from 'react-native-picker-select'; 
import { apiFetch } from '../../store/apiClient';


export default function CreateProperty() {
  const [title, setTitle] = useState("");           
  const [caption, setCaption] = useState("");       
  const [image, setImage] = useState(null);         
  const [imageBase64, setImageBase64] = useState(null); 
  const [loading, setLoading] = useState(false);    
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");      
  const [rentPrice, setRentPrice] = useState("");  // برای اجاره
  const [mortgagePrice, setMortgagePrice] = useState(""); // برای رهن
  const [area, setArea] = useState("");     
  const [city, setCity] = useState("");        
  const [propertyType, setPropertyType] = useState(""); // rent | mortgage | sale

  const router = useRouter();
  const { accessToken } = useAuthStore();

  const {  createProperty3, setCreateProperty3} = useFilterStore();

   const propertyTypeLabels = {
    sale: "فروش",
    rent: "کرایه",
    mortgage: "گرو",
    rent_mortgage: "گرو و کرایه",
  };



  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("عدم دسترسی", "برای اضافه کردن عکس ابتدا اجازه دسترسی به گالری را بدهید");
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
      console.error("خطا در انتخاب عکس:", error);
      Alert.alert("خطا", "مشکلی در انتخاب عکس پیش آمد");
    }
  };

  const handleSubmit = async () => {
    if (!title || !caption || !imageBase64 || !createProperty3.location || !createProperty3.propertyType || !city) {
      Alert.alert("خطا", "لطفاً همه‌ی فیلدهای ضروری را پر کنید");
      return;
    }

    // ✅ اعتبارسنجی شرطی بر اساس نوع آگهی
  if (createProperty3.propertyType === "sale" && !createProperty3.price) {
    Alert.alert("خطا", "لطفاً قیمت فروش را وارد کنید");
    return;
  }
  if (createProperty3.propertyType === "rent" && !createProperty3.rentPrice) {
    Alert.alert("خطا", "لطفاً مبلغ اجاره را وارد کنید");
    return;
  }
  if (createProperty3.propertyType === "mortgage" && !createProperty3.mortgagePrice) {
    Alert.alert("خطا", "لطفاً مبلغ رهن را وارد کنید");
    return;
  }
  if (createProperty3.propertyType === "rent_mortgage") {
    if (!createProperty3.rentPrice) {
      Alert.alert("خطا", "لطفاً مبلغ اجاره را وارد کنید");
      return;
    }
    if (!createProperty3.mortgagePrice) {
      Alert.alert("خطا", "لطفاً مبلغ رهن را وارد کنید");
      return;
    }
  }

    try {
      setLoading(true);

      const uriParts = image.split(".");
      const fileExtension = uriParts[uriParts.length - 1];
      const imageType = fileExtension ? `image/${fileExtension.toLowerCase()}` : "image/jpeg";
      const imageDataUri = `data:${imageType};base64,${imageBase64}`;

      // ساخت payload بر اساس مدل
      let payload = {
        title,
        description: caption,
        image: imageDataUri,
        phoneNumber,
        location: createProperty3.location,   // از استور
        area: createProperty3.area,           // از استور
        city,
        type: createProperty3.propertyType,

      };

    if (createProperty3.propertyType === "sale") {
  payload.price = createProperty3.price;
} else if (createProperty3.propertyType === "rent") {
  payload.rentPrice = createProperty3.rentPrice;
} else if (createProperty3.propertyType === "mortgage") {
  payload.mortgagePrice = createProperty3.mortgagePrice;
} else if (createProperty3.propertyType === "rent_mortgage") {
  payload.rentPrice = createProperty3.rentPrice;
  payload.mortgagePrice = createProperty3.mortgagePrice;
}




      const response = await apiFetch("/properties", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = "مشکلی پیش آمد";
        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch (e) {
          console.error("خطا در خواندن پاسخ:", e);
        }
        Alert.alert("خطا", errorMessage);
        setLoading(false);
        return;
      }

      Alert.alert("موفقیت", "ملک با موفقیت ثبت شد");
      setTitle("");
      setCaption("");
      setImage(null);
      setImageBase64(null);
      setPhoneNumber("");

      setCity("");
      setCreateProperty3({
      location: "",
      setPrice: "",
      setArea: "",
      setPropertyType: "",
       });
      router.push("/");

    } catch (error) {
      console.error("خطا در ارسال ملک:", error);
      Alert.alert("خطا", error.message || "ارسال با مشکل مواجه شد");
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>ثبت ملک برای فروش, گرو و کرایه</Text>
            <Text style={styles.subtitle}> اگر ملکی برای فروش یا گرو و کرایه دارید میتوانید آنرا در اسرع وقت به فروش یا به کرایه بسپارید</Text>
          </View>

          <View style={styles.form}>
            {/* عنوان */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>عنوان آگهی</Text>
              <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="مثال خانه 80 متری با دو اتاق و آشپزخانه سرویس کامل"
                placeholderTextColor={COLORS.placeholderText}
                value={title}
                onChangeText={setTitle}
              />
              </View>
            </View>

            {/* عکس */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>عکس ملک</Text>
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

            {/* توضیحات */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>توضیحات</Text>
              <TextInput
                style={styles.textArea}
                placeholder="توضیحات مربوط به ملک را اینجا بنویسید"
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

       <View style={styles.formGroup}>
  <Text style={styles.label}>نوع آگهی</Text>
  <TouchableOpacity
    style={styles.inputContainer}
    onPress={() =>
      router.push({
        pathname: "/filter",
        params: { type: "propertyType" }, // 👈 صفحه انتخاب نوع آگهی
      })
    }
  >
    <Text
      style={{
        color: createProperty3.propertyType ? COLORS.black : COLORS.placeholderText,
        fontSize: 16,
      }}
    >
      {propertyTypeLabels[createProperty3.propertyType] || "نوع آگهی را انتخاب کنید"}
    </Text>
  </TouchableOpacity>
</View>


{createProperty3.propertyType === "sale" && (
  <View style={styles.formGroup}>
    <Text style={styles.label}>قیمت فروش</Text>
    <TouchableOpacity
      style={styles.inputContainer}
      onPress={() =>
        router.push({
          pathname: "/filter",
          params: { type: "price" },
        })
      }
    >
      <Text
        style={{
          color: createProperty3.price ? COLORS.black : COLORS.placeholderText,
          fontSize: 16,
        }}
      >
        {createProperty3.price || "قیمت فروش را انتخاب کنید"}
      </Text>
    </TouchableOpacity>
  </View>
)}

{/* کرایه */}
{(createProperty3.propertyType === "rent" || createProperty3.propertyType === "rent_mortgage") && (
  <View style={styles.formGroup}>
    <Text style={styles.label}>کرایه</Text>
    <TouchableOpacity
      style={styles.inputContainer}
      onPress={() =>
        router.push({
          pathname: "/filter",
          params: { type: "rentPrice" },
        })
      }
    >
      <Text
        style={{
          color: createProperty3.rentPrice ? COLORS.black : COLORS.placeholderText,
          fontSize: 16,
        }}
      >
        {createProperty3.rentPrice || "مبلغ کرایه را انتخاب کنید"}
      </Text>
    </TouchableOpacity>
  </View>
)}

{/* گرو */}
{(createProperty3.propertyType === "mortgage" || createProperty3.propertyType === "rent_mortgage") && (
  <View style={styles.formGroup}>
    <Text style={styles.label}>گرو</Text>
    <TouchableOpacity
      style={styles.inputContainer}
      onPress={() =>
        router.push({
          pathname: "/filter",
          params: { type: "mortgagePrice" },
        })
      }
    >
      <Text
        style={{
          color: createProperty3.mortgagePrice ? COLORS.black : COLORS.placeholderText,
          fontSize: 16,
        }}
      >
        {createProperty3.mortgagePrice || "مبلغ گرو را انتخاب کنید"}
      </Text>
    </TouchableOpacity>
  </View>
)}



            {/* شماره تماس */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>نمبر تلفون</Text>
              <TextInput
                style={styles.inputContainer}
                placeholder="نمبره تلفون خودرا بنویسید"
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
        params: { section: "property" }, // 👈 مسیر برگشت
      })
    }
  >
    <Text
      style={{
        color: createProperty3.location ? COLORS.black : COLORS.placeholderText,
        fontSize: 16,
      }}
    >
      {createProperty3.location || "ولایت خود را انتخاب کنید"}
    </Text>
  </TouchableOpacity>
</View>

             {/* موقعیت */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>منطقه</Text>
              <TextInput
                style={styles.inputContainer}
                placeholder="آدرس دقیق ملک را بنویسید"
                placeholderTextColor={COLORS.placeholderText}
                value={city}
                onChangeText={setCity}
              />
            </View>


           

            {/* متراژ */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>متراژ (متر مربع)</Text>
              <TextInput
                style={styles.inputContainer}
                placeholder="مثال: ۸۰"
                placeholderTextColor={COLORS.placeholderText}
                value={area}
                onChangeText={setArea}
                
              />
            </View>

          


            {/* دکمه ثبت */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.black} />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={20} color={COLORS.black} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>ثبت ملک</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

