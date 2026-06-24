import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../component/ProfileHeader";
import LogoutButton from "../../component/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../colectionColor/colors";
import { Linking } from "react-native";

export default function Profile() {


  const router = useRouter();



  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

    


      {/* دکمه رفتن به صفحه راهنما و قوانین */}
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => router.push("/help-and-rules")}
      >
        <Ionicons name="help-circle-outline" size={20} color={COLORS.textDark} />
        <Text style={styles.helpButtonText}>راهنما و قوانین</Text>
      </TouchableOpacity>

      {/* دکمه رفتن به صفحه ذخیره‌ها */}
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => router.push("/SavedAdsScreen")}
      >
        <Ionicons name="folder-open-outline" size={20} color={COLORS.textDark} />
        <Text style={styles.helpButtonText}>آگهی‌های ذخیره‌شده</Text>
      </TouchableOpacity>

      {/* دکمه رفتن به صفحه آگهی‌های من */}
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => router.push("/UserAdsScreen")}
      >
        <Ionicons name="briefcase-outline" size={20} color={COLORS.textDark} />
        <Text style={styles.helpButtonText}>آگهی‌های من</Text>
      </TouchableOpacity>
            {/* شبکه‌های اجتماعی */}
<View style={styles.containerSocial}>
  <Text style={styles.titleSocial}>مارا در شبکه های اجتماعی دنبال کنید.</Text>

 <View style={styles.grid}>
  <TouchableOpacity
    style={styles.socialButton}
    onPress={() => Linking.openURL("https://www.instagram.com/hamekarofficial/")}
  >
    <Ionicons name="logo-instagram" size={24}  />
    <Text style={styles.socialText}>اینستاگرام</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.socialButton}
    onPress={() => Linking.openURL("https://wa.me/41786023739")}
  >
    <Ionicons name="logo-whatsapp" size={24}  />
    <Text style={styles.socialText}>واتساپ</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.socialButton}
    onPress={() => Linking.openURL("mailto:dastnevis.site@gmail.com")}
  >
    <Ionicons name="mail-outline" size={24}  />
    <Text style={styles.socialText}>ایمیل</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.socialButton}
    onPress={() => Linking.openURL("https://facebook.com/profile.php?id=61590900141814")}
  >
    <Ionicons name="logo-facebook" size={24}  />
    <Text style={styles.socialText}>فیسبوک</Text>
  </TouchableOpacity>
  </View>
 </View>
</View>
   
  );
}

