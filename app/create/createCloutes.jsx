import { useEffect, useState } from 'react';
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
  Modal
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



export default function CreateCloutes() {
  const [title, setTitle] = useState("");            
  const [caption, setCaption] = useState("");        
 const [images, setImages] = useState([null, null, null, null, null]);
  const [imagesBase64, setImagesBase64] = useState([null, null, null, null, null]);
  const [loading, setLoading] = useState(false);    
  const [phoneNumber, setPhoneNumber] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  
  const router = useRouter();
  const { accessToken } = useAuthStore();

  const { createCloutes2, setCreateCloutes2 } = useFilterStore();

  const { id } = useLocalSearchParams();


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
  if (!title || !caption || !phoneNumber || !createCloutes2.location) {
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

    const response = await apiFetch(id ? `/cloutes/${id}` : "/cloutes", {
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
        location: createCloutes2.location,
        cloutesTexture: createCloutes2.cloutesTexture,
        cloutesModel: createCloutes2.cloutesModel,
        cloutesStatus: createCloutes2.cloutesStatus,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      Alert.alert("خطا", errorData.message || "مشکلی پیش آمد");
      return;
    }

    Alert.alert("موفقیت", id ? "آگهی پوشاک با موفقیت ویرایش شد" : "آگهی پوشاک با موفقیت اضافه شد");

    // پاک کردن فرم فقط در حالت ایجاد
      setTitle("");
      setCaption("");
      setImages([null, null, null, null, null]);
      setImagesBase64([null, null, null, null, null]);
      setPhoneNumber("");
      setAddress("");
      setCreateCloutes2({
        location: "",
        cloutesTexture: "",
        cloutesModel: "",
        cloutesStatus: "",
      });

    router.push("/page/cloutes");
  } catch (error) {
    console.error("خطا در ارسال:", error);
    Alert.alert("خطا", error.message || "ارسال با مشکل مواجه شد");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  if (id) {
    const fetchCloute = async () => {
      try {
        const response = await apiFetch(`/cloutes/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          console.error("خطا در گرفتن آگهی پوشاک");
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
        setCreateCloutes2({
          location: data.location || "",
          cloutesTexture: data.cloutesTexture || "",
          cloutesModel: data.cloutesModel || "",
          cloutesStatus: data.cloutesStatus || "",
        });
      } catch (error) {
        console.error("خطا در گرفتن اطلاعات آگهی:", error);
      }
    };

    fetchCloute();
  }
}, [id]);



return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
      <View style={styles.card}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>پوشاک خود را ثبت کنید</Text>
          <Text style={styles.subtitle}>
            با معرفی پوشاک خود، امکان خرید و فروش آسان‌تر و سریع‌تر را فراهم کنید.
          </Text>
        </View>

        <View style={styles.form}>
          {/* title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>عنوان آگهی</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="مثال: فروش یک کت زمستانی"
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
              placeholder="مثال: فروش یک کت زمستانی"
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

          
          {/* price */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>منطقه و آدرس</Text>
            <TextInput
              style={styles.inputContainer}
              placeholder="آدرس خودرا بنویسید"
              placeholderTextColor={COLORS.placeholderText}
              value={address}
              onChangeText={setAddress}
           
            />
          </View>

           <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
  {/* location */}
    <TouchableOpacity style={styles.halfBox} onPress={() => router.push({
       pathname: "/page/select-location",
          params: { section: "clothes" },
        })
      }
    >
      <Text
        style={{
          color: createCloutes2.location ? COLORS.black : COLORS.placeholderText,
        }}
      >
        {createCloutes2.location || "ولایت خود را انتخاب کنید"}
      </Text>
    </TouchableOpacity>
  

  {/* model */}
    <TouchableOpacity style={styles.halfBox}
      onPress={() =>
        router.push({
          pathname: "/filter",
          params: { type: "cloutes1Model" },
        })
      }
    >
      <Text
        style={{
          color: createCloutes2.cloutesModel ? COLORS.black : COLORS.placeholderText,
        }}
      >
        {createCloutes2.cloutesModel || "مدل را انتخاب کنید"}
      </Text>
    </TouchableOpacity>
 

  {/* status */}

    <TouchableOpacity  style={styles.halfBox}
      onPress={() =>
        router.push({
          pathname: "/filter",
          params: { type: "cloutes1Status" },
        })
      }
    >
      <Text
        style={{
          color: createCloutes2.cloutesStatus ? COLORS.black : COLORS.placeholderText,
        }}
      >
        {createCloutes2.cloutesStatus || "وضعیت را انتخاب کنید"}
      </Text>
    </TouchableOpacity>

  {/* texture */}
    <TouchableOpacity style={styles.halfBox}
      onPress={() =>
        router.push({
          pathname: "/filter",
          params: { type: "cloutes1Texture" },
        })
      }
    >
      <Text
        style={{
          color: createCloutes2.cloutesTexture ? COLORS.black : COLORS.placeholderText,
        }}
      >
        {createCloutes2.cloutesTexture || "جنس/پارچه را انتخاب کنید"}
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
                <Text style={styles.buttonText}>ثبت آگهی پوشاک</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);
 };
