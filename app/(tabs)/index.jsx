import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal
} from 'react-native';
import { Image } from "expo-image";
import { useAuthStore } from '../../store/authStore';
import { useEffect, useState } from 'react';
import styles from "../../assets/styles/home.styles";

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../colectionColor/colors';
import { formatPublishDate } from '../../lib/utils';
import Loader from '../../component/Loader';
import { Link, useRouter } from 'expo-router';
import { apiFetch } from '../../store/apiClient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useFilterStore } from "../../store/fileStore";
import { carFormStyles } from "../../assets/styles/CarFormStyles";


export default function Jobs() {
  const { accessToken } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [addMore, setAddMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState("jobs");
  const [checking, setChecking] = useState(true);
  const { index5, jobs1 } = useFilterStore();
  
  const [showSearchButton, setShowSearchButton] = useState(false);


  const router = useRouter();
  const params = useLocalSearchParams();




  const fetchJobs = async (pageNum = 1, refresh = false) => {
  try {
    if (refresh) setRefreshing(true);
    else if (pageNum === 1) setLoading(true);

     const queryParams = new URLSearchParams({
      page: pageNum,
      limit: 5,
      title: searchQuery,
      location: index5.location || "",
      income: jobs1.income || "",
      workingHours: jobs1.workingHours || "",
      paymentType: jobs1.paymentType || "",
      type: selectedType || "",
    });


    const res = await apiFetch(`/jobs?${queryParams.toString()}`);



    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || "خطا در گرفتن آگهی‌های شغلی");

    setJobs(pageNum === 1 || refresh ? data.jobs : [...jobs, ...data.jobs]);
    setAddMore(pageNum < data.totalPages);
    setPage(pageNum);
  } catch (error) {
    console.error("fetch error:", error);
  } finally {
    if (refresh) setRefreshing(false);
    else setLoading(false);
  }
};



  useEffect(() => {
  const checkToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) {
      router.replace("/(auth)/login");
      return; // مهم
    }

    const res = await apiFetch("/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (res.ok) {
      const data = await res.json();

      const { setTokens } = useAuthStore.getState();
      await setTokens(data.accessToken, refreshToken);

      await fetchJobs();
      return; // مهم
    } else {
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      router.replace("/(auth)/login");
      return; // مهم
    }

  } catch (err) {
    router.replace("/(auth)/login");
    return; // مهم
  } finally {
    setChecking(false);
  }
};
  checkToken();



  }, []);

  useEffect(() => {
  if (
    searchQuery.length > 0 ||
    index5.location ||
    jobs1.income ||
    jobs1.workingHours ||
    jobs1.paymentType
  ) {
    setShowSearchButton(true);
  } else {
    setShowSearchButton(false);
  }
}, [searchQuery, index5.location, jobs1.income, jobs1.workingHours, jobs1.paymentType]);


  const handleLoadMore = async () => {
    if (addMore && !loading && !refreshing) {
      await fetchJobs(page + 1);
    }
  };


  const renderItem = ({ item }) => (
    <Link
      href={{
        pathname: "/details/job-details",
        params: { data: JSON.stringify(item) },
      }}
      asChild
    >
      <TouchableOpacity activeOpacity={0.5}>
        <View style={styles.propertyCard}>

 <View style={styles.propertyRow}>
  
  <View style={styles.propertyContent}>
    <Text style={styles.propertyTitle}>{item.title}</Text>
    {item.location && <Text style={styles.propertyInfo}>ولایت: {item.location}</Text>}
    {item.income && <Text style={styles.propertyInfo}>معاش: {item.income}</Text>}

   
    <Text style={styles.propertyDate}>
      ثبت شده در تاریخ {formatPublishDate(item.createdAt)}
    </Text>
  </View>
    {item.images && item.images.length > 0 ? (
    <Image source={{ uri: item.images[0] }} style={styles.propertyImage} contentFit="contain" />
  ) : item.image ? (
    <Image source={{ uri: item.image }} style={styles.propertyImage} contentFit="contain" />
  ) : null}

</View>
</View>


      </TouchableOpacity>
    </Link>
  );

  if (loading) return <Loader />;

 return (
 <View style={styles.container}>

    {/* مودال فیلترها */}
    <Modal
      visible={showFilters}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={{ flex: 1, justifyContent: "flex-start", backgroundColor: "rgba(0,0,0,0.3)" }}>
        <View
          style={{
            height: "100%", // نصف صفحه
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
            marginTop: 70,
          }}
        >
          {/* دکمه بستن */}
          <TouchableOpacity onPress={() => setShowFilters(false)} style={{ alignSelf: "flex-start", marginBottom: 15, }}>
             <Ionicons name="close" size={35} color={COLORS.black} />
          </TouchableOpacity>

          {/* ورودی متن و ولایت */}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
            <TextInput
              style={carFormStyles.textInput}
              placeholder="کار مورد نظر خودرا بنویسید"
              placeholderTextColor={COLORS.placeholderText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <View style={carFormStyles.touchable}>
              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: "/page/select-location", params: { section: "jobs" } })
                }
              >
                <Text
                  style={{
                    color: index5.location ? COLORS.black : COLORS.placeholderText,
                    fontSize: 16,
                  }}
                >
                  {index5.location || "ولایت"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* فیلترها */}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
            <TouchableOpacity
              style={carFormStyles.touchable}
              onPress={() => router.push({ pathname: "/filter", params: { type: "income1" } })}
            >
              <Text
               numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: jobs1.income ? COLORS.black : COLORS.placeholderText }}>
                {jobs1.income || "معاش"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={carFormStyles.touchable}
              onPress={() => router.push({ pathname: "/filter", params: { type: "paymentType1" } })}
            >
              <Text
               numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: jobs1.paymentType ? COLORS.black : COLORS.placeholderText }}>
                {jobs1.paymentType || "دسته بندی"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={carFormStyles.touchable}
              onPress={() => router.push({ pathname: "/filter", params: { type: "workingHours1" } })}
            >
              <Text
               numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: jobs1.workingHours ? COLORS.black : COLORS.placeholderText }}>
                {jobs1.workingHours || "ساعت کاری"}
              </Text>
            </TouchableOpacity>
          </View>

       
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                fetchJobs(1, true);
                setShowSearchButton(false);
                setShowFilters(false); // بستن مودال بعد از جستجو
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="search" size={20} color={COLORS.white} />
                <Text style={styles.buttonText}>جستجو کنید</Text>
              </View>
            </TouchableOpacity>
      
        </View>
      </View>
    </Modal>

  <FlatList
    data={jobs}
    renderItem={renderItem}
    keyExtractor={(item) => item._id}
    contentContainerStyle={styles.listContainer}
    showsVerticalScrollIndicator={false}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={() => fetchJobs(1, true)}
        colors={[COLORS.primary]}
        tintColor={COLORS.primary}
      />
    }
    onEndReached={handleLoadMore}
    onEndReachedThreshold={0.1}

    // فقط index=0 (عنوان + سرچ + فیلترها) ثابت می‌ماند
    stickyHeaderIndices={[0]}
      ListHeaderComponent={
          <>
    {/* دکمه باز/بستن فیلترها */}
    <View>
      <TouchableOpacity
        style={styles.filterToggleButton}
        onPress={() => setShowFilters(true)} // فقط باز کردن مودال
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="filter" size={22} color={COLORS.black} />
          <Text style={styles.buttonText1}>نمایش فیلترها</Text>
        </View>
      </TouchableOpacity>
    </View>

  </>
}

    ListFooterComponent={
      addMore && jobs.length > 0 ? (
        <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary} />
      ) : null
    }
    ListEmptyComponent={
      <View style={styles.emptyContainer}>
        <Ionicons name="briefcase-outline" size={60} color={COLORS.textSecondary} />
        <Text style={styles.emptyText}>هنوز آگهی شغلی اضافه نشده</Text>
      </View>
    }
  />
</View>
);
}

