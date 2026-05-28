import { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../../colectionColor/colors';
import * as ImagePicker from "expo-image-picker";

import { useAuthStore } from "../../store/authStore";
import { useFilterStore } from "../../store/fileStore";

import { apiFetch } from '../../store/apiClient';


export default function CreateProperty() {
  // state ها
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([null, null, null, null, null]);
  const [imagesBase64, setImagesBase64] = useState([null, null, null, null, null]);
  const [loading, setLoading] = useState(false); // هم برای fetch و هم برای submit
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");

  const router = useRouter();
  const { accessToken } = useAuthStore();
 // const { createProperty3, setCreateProperty3 } = useFilterStore();
 const createProperty3 = useFilterStore(
  state => state.createProperty3
);

const setCreateProperty3 = useFilterStore(
  state => state.setCreateProperty3
);
  const { id } = useLocalSearchParams();

  const propertyTypeLabels = {
    sale: "فروش",
    rent: "کرایه",
    mortgage: "گرو",
    rent_mortgage: "گرو و کرایه",
  };

  // انتخاب عکس
  const pickImage = async (index) => {
    try {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("عدم دسترسی", "برای اضافه کردن عکس ابتدا اجازه دسترسی به گالری را بدهید");
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.15,
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

  // گرفتن آگهی قبلی در حالت ویرایش
  useEffect(() => {
    //  console.log("UPDATED:", createProperty3);
    if (id) {
      const fetchProperty = async () => {
        try {
          setLoading(true);

          const response = await apiFetch(`/properties/${id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (!response.ok) {
            console.error("خطا در گرفتن آگهی ملک");
            return;
          }

          const data = await response.json();

          setTitle(data.title || "");
          setCaption(data.description || "");
          setPhoneNumber(data.phoneNumber || "");
          setCity(data.city || "");

          if (data.images && Array.isArray(data.images)) {
            const paddedImages = [...data.images];
            while (paddedImages.length < 5) paddedImages.push(null);
            setImages(paddedImages);
            setImagesBase64([null, null, null, null, null]);
          }

          setCreateProperty3({
            location: data.location || "",
            area: data.area || "",
            propertyType: data.type || "",
            price: data.price || "",
            rentPrice: data.rentPrice || "",
            mortgagePrice: data.mortgagePrice || "",
          });
        } catch (error) {
          console.error("خطا در گرفتن اطلاعات آگهی:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProperty();
    }
  }, [id]);

  // ارسال فرم
  const handleSubmit = async () => {
    if (!title || !caption || !phoneNumber || !createProperty3.location || !createProperty3.propertyType || !city) {
      Alert.alert("خطا", "لطفاً همه‌ی فیلدهای ضروری را پر کنید");
      return;
    }

    // اعتبارسنجی شرطی
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
      if (!createProperty3.rentPrice || !createProperty3.mortgagePrice) {
        Alert.alert("خطا", "لطفاً مبلغ اجاره و رهن را وارد کنید");
        return;
      }
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
          imageDataUris.push(uri);
        }
      }

      let payload = {
        title,
        description: caption,
        images: imageDataUris,
        phoneNumber,
        location: createProperty3.location,
        area: createProperty3.area,
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

      const response = await apiFetch(id ? `/properties/${id}` : "/properties", {
        method: id ? "PUT" : "POST",
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

        return;
      }

      Alert.alert("موفقیت", id ? "آگهی ملک با موفقیت ویرایش شد" : "آگهی ملک با موفقیت ثبت شد");

setTitle("");
setCaption("");
setPhoneNumber("");
setCity("");

setImages([null, null, null, null, null]);
setImagesBase64([null, null, null, null, null]);

setCreateProperty3({
  location: "",
  area: "",
  propertyType: "",
  price: "",
  rentPrice: "",
  mortgagePrice: "",
});


      router.push("/page/properties");
    } catch (error) {
      console.error("خطا در ارسال ملک:", error);
      Alert.alert("خطا", error.message || "ارسال با مشکل مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  // اگر در حالت ویرایش هستیم و هنوز داده‌ها نیامده‌اند
  if (loading && id) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10 }}>در حال بارگذاری...</Text>
      </View>
    );
  }

//console.log("propertyType:", createProperty3.propertyType);

  // بخش رندر فرم
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



             {/* موقعیت */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>منطقه و آدرس</Text>
              <TextInput
                style={styles.inputContainer}
                placeholder="آدرس دقیق ملک را بنویسید"
                placeholderTextColor={COLORS.placeholderText}
                value={city}
                onChangeText={setCity}
              />
            </View>


           
<View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
  {/* نوع آگهی */}
  <TouchableOpacity
    style={styles.halfBox}
    onPress={() =>
      router.push({
        pathname: "/filter",
        params: { type: "propertyType" },
      })
    }
  >
    <Text style={{ color: createProperty3.propertyType ? COLORS.black : COLORS.placeholderText, fontSize: 14 }}>
      {propertyTypeLabels[createProperty3.propertyType] || "کلیک کنید و نوع آگهی را انتخاب کنید"}
    </Text>
  </TouchableOpacity>


  {/* قیمت فروش */}
  {createProperty3.propertyType === "sale" && (
    <TouchableOpacity
      style={styles.halfBox}
      onPress={() =>
        router.push({
          pathname: "/filter",
          params: { type: "price" },
        })
      }
    >
      <Text style={{ color: createProperty3.price ? COLORS.black : COLORS.placeholderText }}>
        {createProperty3.price || "قیمت فروش را انتخاب کنید"}
      </Text>
    </TouchableOpacity>
  )}

  {/* کرایه */}
  {(createProperty3.propertyType === "rent" || createProperty3.propertyType === "rent_mortgage") && (
    <TouchableOpacity
      style={styles.halfBox}
      onPress={() =>
        router.push({
          pathname: "/filter",
          params: { type: "rentPrice" },
        })
      }
    >
      <Text style={{ color: createProperty3.rentPrice ? COLORS.black : COLORS.placeholderText }}>
        {createProperty3.rentPrice || "مبلغ کرایه را انتخاب کنید"}
      </Text>
    </TouchableOpacity>
  )}

  {/* گرو */}
  {(createProperty3.propertyType === "mortgage" || createProperty3.propertyType === "rent_mortgage") && (
    <TouchableOpacity
      style={styles.halfBox}
      onPress={() =>
        router.push({
          pathname: "/filter",
          params: { type: "mortgagePrice" },
        })
      }
    >
      <Text style={{ color: createProperty3.mortgagePrice ? COLORS.black : COLORS.placeholderText }}>
        {createProperty3.mortgagePrice || "مبلغ گرو را انتخاب کنید"}
      </Text>
    </TouchableOpacity>
  )}

  {/* location */}
  <TouchableOpacity
    style={styles.halfBox}
    onPress={() =>
      router.push({
        pathname: "/page/select-location",
        params: { section: "property" },
      })
    }
  >
    <Text style={{ color: createProperty3.location ? COLORS.black : COLORS.placeholderText, fontSize: 14 }}>
      {createProperty3.location || "ولایت خود را انتخاب کنید"}
    </Text>
  </TouchableOpacity>

  {/* area */}
  <TouchableOpacity
    style={styles.halfBox}
    onPress={() =>
      router.push({
        pathname: "/filter",
        params: { type: "area" },
      })
    }
  >
    <Text style={{ color: createProperty3.area ? COLORS.black : COLORS.placeholderText }}>
      {createProperty3.area || "متراژ خانه یا زمین خویش را انتخاب کنید"}
    </Text>
  </TouchableOpacity>
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

