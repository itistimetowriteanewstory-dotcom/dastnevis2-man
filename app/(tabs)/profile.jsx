import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../component/ProfileHeader";
import LogoutButton from "../../component/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../colectionColor/colors";


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
        <Ionicons name="help-circle-outline" size={20} color={COLORS.white} />
        <Text style={styles.helpButtonText}>راهنما و قوانین</Text>
      </TouchableOpacity>

      {/* دکمه رفتن به صفحه ذخیره‌ها */}
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => router.push("/SavedAdsScreen")}
      >
        <Ionicons name="folder-open-outline" size={20} color={COLORS.white} />
        <Text style={styles.helpButtonText}>آگهی‌های ذخیره‌شده</Text>
      </TouchableOpacity>

      {/* دکمه رفتن به صفحه آگهی‌های من */}
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => router.push("/UserAdsScreen")}
      >
        <Ionicons name="briefcase-outline" size={20} color={COLORS.white} />
        <Text style={styles.helpButtonText}>آگهی‌های من</Text>
      </TouchableOpacity>
    </View>
  );
}

