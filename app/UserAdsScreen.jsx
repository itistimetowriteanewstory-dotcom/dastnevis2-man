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
  const [cars, setCars] = useState([]); // 👈 اضافه شد
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [cloutes, setCloutes] = useState([]);
  const [kitchen, setKitchen] = useState([]);
  const [eats, setEats] = useState([]);


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

      const carsRes = await apiFetch("/car/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const carsData = await carsRes.json();
      if (!carsRes.ok) throw new Error(carsData.message || "خطا در بارگذاری موترها");

      const cloutesRes = await apiFetch("/cloutes/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
      });
       const cloutesData = await cloutesRes.json();
      if (!cloutesRes.ok) throw new Error(cloutesData.message || "خطا در بارگذاری پوشاک");

      const kitchenRes = await apiFetch("/kitchen/user", {
       headers: { Authorization: `Bearer ${accessToken}` },
      });
      const kitchenData = await kitchenRes.json();
      if (!kitchenRes.ok) throw new Error(kitchenData.message || "خطا در بارگذاری لوازم خانه");

     const eatsRes = await apiFetch("/eat/user", {
     headers: { Authorization: `Bearer ${accessToken}` },
     });
      const eatsData = await eatsRes.json();
      if (!eatsRes.ok) throw new Error(eatsData.message || "خطا در بارگذاری مواد غذایی‌ها");




      setJobs(jobsData);
      setProperties(propsData);
      setCars(carsData);
      setCloutes(cloutesData);
      setKitchen(kitchenData);
      setEats(eatsData);

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

  // 📌 حذف موتر
  const handleDeleteCar = async (carId) => {
    try {
      setDeleteId(carId);
      const res = await apiFetch(`/car/${carId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در حذف موتر");

      setCars((prev) => prev.filter((c) => c._id !== carId));
      Alert.alert("موفق", "موتر حذف شد");
    } catch (error) {
      Alert.alert("خطا", error.message || "مشکلی در حذف موتر پیش آمد");
    } finally {
      setDeleteId(null);
    }
  };

  const handleDeleteCloute = async (clouteId) => {
  try {
    setDeleteId(clouteId);
    const res = await apiFetch(`/cloutes/${clouteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "خطا در حذف پوشاک");

    setCloutes((prev) => prev.filter((c) => c._id !== clouteId));
    Alert.alert("موفق", "پوشاک حذف شد");
  } catch (error) {
    Alert.alert("خطا", error.message || "مشکلی در حذف پوشاک پیش آمد");
  } finally {
    setDeleteId(null);
  }
};

const handleDeleteKitchen = async (kitchenId) => {
  try {
    setDeleteId(kitchenId);
    const res = await apiFetch(`/kitchen/${kitchenId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "خطا در حذف وسیله خانه");

    setKitchen((prev) => prev.filter((k) => k._id !== kitchenId));
    Alert.alert("موفق", "وسیله خانه حذف شد");
  } catch (error) {
    Alert.alert("خطا", error.message || "مشکلی در حذف وسیله خانه پیش آمد");
  } finally {
    setDeleteId(null);
  }
};


const handleDeleteEat = async (eatId) => {
  try {
    setDeleteId(eatId);
    const res = await apiFetch(`/eat/${eatId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "خطا در حذف مواد غذایی");

    setEats((prev) => prev.filter((e) => e._id !== eatId));
    Alert.alert("موفق", "مواد غذایی حذف شد");
  } catch (error) {
    Alert.alert("خطا", error.message || "مشکلی در حذف مواد غذایی پیش آمد");
  } finally {
    setDeleteId(null);
  }
};


  const confirmDeleteJob = (jobId) => {
    Alert.alert("حذف شغل؟", "آیا مطمئن هستید؟", [
      { text: "لغو", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => handleDeleteJob(jobId) },
    ]);
  };

  const confirmDeleteProperty = (propertyId) => {
    Alert.alert("حذف ملک؟", "آیا مطمئن هستید؟", [
      { text: "لغو", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => handleDeleteProperty(propertyId) },
    ]);
  };

  const confirmDeleteCar = (carId) => {
    Alert.alert("حذف موتر؟", "آیا مطمئن هستید؟", [
      { text: "لغو", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => handleDeleteCar(carId) },
    ]);
  };

   const confirmDeleteCloute = (clouteId) => {
    Alert.alert("حذف موتر؟", "آیا مطمئن هستید؟", [
      { text: "لغو", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => handleDeleteCloute(clouteId) },
    ]);
  };

  const confirmDeleteKitchen = (kitchenId) => {
    Alert.alert("حذف موتر؟", "آیا مطمئن هستید؟", [
      { text: "لغو", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => handleDeleteKitchen(kitchenId) },
    ]);
  };

  const confirmDeleteEat = (eatId) => {
    Alert.alert("حذف موتر؟", "آیا مطمئن هستید؟", [
      { text: "لغو", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => handleDeleteEat(eatId) },
    ]);
  };

  // 📌 ترکیب همه آگهی‌ها
  const allAds = [
  ...jobs.map((j) => ({ ...j, adType: "job" })),
  ...properties.map((p) => ({ ...p, adType: "property" })),
  ...cars.map((c) => ({ ...c, adType: "car" })),
  ...cloutes.map((cl) => ({ ...cl, adType: "cloute" })),
  ...kitchen.map((k) => ({ ...k, adType: "kitchen" })),
  ...eats.map((e) => ({ ...e, adType: "eat" })),
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
           {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.jobImage} contentFit="contain" />
          ) : item.image ? (
          <Image source={{ uri: item.image }} style={styles.jobImage} contentFit="contain" />
          ) : null}


            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>{item.title}</Text>

              {/* نمایش اطلاعات شغل */}
              {item.adType === "job" && item.income && (
                <Text style={styles.jobTitle}>معاش: {item.income}</Text>
              )}

              {/* نمایش اطلاعات ملک */}
              {item.adType === "property" && (
                <>
                  {item.price && <Text style={styles.jobTitle}>قیمت فروش: {item.price}</Text>}
                  {item.rentPrice && <Text style={styles.jobTitle}>کرایه: {item.rentPrice}</Text>}
                  {item.mortgagePrice && <Text style={styles.jobTitle}>گرو: {item.mortgagePrice}</Text>}
                </>
              )}

              {/* نمایش اطلاعات موتر */}
              {item.adType === "car" && (
                <>
                  {item.brand && <Text style={styles.jobTitle}>برند: {item.brand}</Text>}
                  {item.price && <Text style={styles.jobTitle}>قیمت: {item.price}</Text>}
                </>
              )}

              {item.adType === "cloute" && (
               <>
                {item.status && <Text style={styles.jobTitle}>وضعیت: {item.status}</Text>}
               {item.price && <Text style={styles.jobTitle}>قیمت: {item.price}</Text>}
                </>
               )}

                {item.adType === "kitchen" && (
               <>
               {item.price && <Text style={styles.jobTitle}>قیمت: {item.price}</Text>}
               </>
                )}

              {item.adType === "eat" && (
                <>
               {item.price && <Text style={styles.jobTitle}>قیمت: {item.price}</Text>}
             
                </>
               )}

              <Text style={styles.jobCaption} numberOfLines={2}>
                {item.caption || item.description}
              </Text>
              <Text style={styles.jobDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
 <View style={{ flexDirection: "row" }}>
            {/* دکمه حذف */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                item.adType === "job"
                  ? confirmDeleteJob(item._id)
                  : item.adType === "property"
                  ? confirmDeleteProperty(item._id)
                  : item.adType === "car"
                  ? confirmDeleteCar(item._id)
                  : item.adType === "cloute"
                  ? confirmDeleteCloute(item._id)
                  : item.adType === "kitchen"
                  ? confirmDeleteKitchen(item._id)
                  : confirmDeleteEat(item._id)


              }
            >
              {deleteId === item._id ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Ionicons name="trash-outline" size={25} color={COLORS.primary} />
              )}
            </TouchableOpacity>
<TouchableOpacity
  style={styles.editButton}
  onPress={() =>
    item.adType === "job"
      ? router.push({ pathname: "/create/createJobs", params: { id: item._id } })
      : item.adType === "property"
      ? router.push({ pathname: "/create/createProperty", params: { id: item._id } })
      : item.adType === "car"
      ? router.push({ pathname: "/create/createCar", params: { id: item._id } })
      : item.adType === "cloute"
      ? router.push({ pathname: "/create/createCloutes", params: { id: item._id } })
      : item.adType === "kitchen"
      ? router.push({ pathname: "/create/createHome", params: { id: item._id } })
      : router.push({ pathname: "/create/createEat", params: { id: item._id } })
  }
>
  <Ionicons name="create-outline" size={25} color={COLORS.primary} />
</TouchableOpacity>


           </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={50} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>هیچ آگهی‌ای ثبت نشده است</Text>
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


