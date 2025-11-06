import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "../colectionColor/api";
import { useAuthStore } from "../store/authStore";
import styles from "../assets/styles/profile.styles"; 
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../colectionColor/colors";
import { Image } from "expo-image";
import Loader from "../component/Loader";
import { apiFetch } from "../store/apiClient";

export default function UserAdsScreen() {
  const [jobs, setJobs] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { accessToken } = useAuthStore();
  const router = useRouter();

  // 📌 گرفتن آگهی‌های کاربر
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const jobsRes = await apiFetch("/jobs/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const jobsData = await jobsRes.json();
      if (!jobsRes.ok) throw new Error(jobsData.message || "خطا در بارگذاری شغل‌ها");

      const propsRes = await apiFetch("/properties/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const propsData = await propsRes.json();
      if (!propsRes.ok) throw new Error(propsData.message || "خطا در بارگذاری ملک‌ها");

      setJobs(jobsData);
      setProperties(propsData);
    } catch (error) {
      Alert.alert("خطا", "بارگذاری اطلاعات کاربر با خطا مواجه شد");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 📌 حذف شغل
  const handleDeleteJob = async (jobId) => {
    try {
      setDeleteId(jobId);
      const res = await apiFetch(`/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در حذف شغل");

      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      Alert.alert("موفق", "شغل حذف شد");
    } catch (error) {
      Alert.alert("خطا", error.message || "مشکلی در حذف شغل پیش آمد");
    } finally {
      setDeleteId(null);
    }
  };

  // 📌 حذف ملک
  const handleDeleteProperty = async (propertyId) => {
    try {
      setDeleteId(propertyId);
      const res = await apiFetch(`/properties/${propertyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در حذف ملک");

      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      Alert.alert("موفق", "ملک حذف شد");
    } catch (error) {
      Alert.alert("خطا", error.message || "مشکلی در حذف ملک پیش آمد");
    } finally {
      setDeleteId(null);
    }
  };

  const confirmDeleteJob = (jobId) => {
  Alert.alert(
    "حذف شغل؟",
    "آیا مطمئن هستید که می‌خواهید این آگهی شغل را حذف کنید؟",
    [
      { text: "لغو", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => handleDeleteJob(jobId) }
    ]
  );
};

const confirmDeleteProperty = (propertyId) => {
  Alert.alert(
    "حذف ملک؟",
    "آیا مطمئن هستید که می‌خواهید این آگهی ملک را حذف کنید؟",
    [
      { text: "لغو", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => handleDeleteProperty(propertyId) }
    ]
  );
};



  // 📌 ترکیب همه آگهی‌ها
  const allAds = [
    ...jobs.map((j) => ({ ...j, adType: "job" })),
    ...properties.map((p) => ({ ...p, adType: "property" })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={styles.jobsHeader}>
        <Text style={styles.jobsTitle}>آگهی‌های ثبت‌شده توسط شما</Text>
        <Text style={styles.jobsCount}>{allAds.length} آگهی</Text>
      </View>

      <FlatList
        data={allAds}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.jobsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Image source={item.image} style={styles.jobImage} />
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>{item.title}</Text>

              {item.adType === "job" && item.income && (
                <Text style={styles.jobTitle}>معاش: {item.income}</Text>
              )}

              {item.adType === "property" && (
                <>
                  {item.price && <Text style={styles.jobTitle}>قیمت فروش: {item.price}</Text>}
                  {item.rentPrice && <Text style={styles.jobTitle}>کرایه: {item.rentPrice}</Text>}
                  {item.mortgagePrice && <Text style={styles.jobTitle}>گرو : {item.mortgagePrice}</Text>}
                </>
              )}

              <Text style={styles.jobCaption} numberOfLines={2}>
                {item.caption || item.description}
              </Text>
              <Text style={styles.jobDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>

            {/* دکمه حذف */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                item.adType === "job"
                  ? confirmDeleteJob(item._id)
                  : confirmDeleteProperty(item._id)
              }
            >
              {deleteId === item._id ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={50} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>آگهی‌ای ثبت نشده است</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/createAdChoice")}
            >
              <Text style={styles.addButtonText}>اولین آگهی خود را ثبت کنید</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}


