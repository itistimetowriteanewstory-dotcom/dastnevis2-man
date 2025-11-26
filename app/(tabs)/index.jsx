import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput
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
 
  const [selectedType, setSelectedType] = useState("jobs");
  const [checking, setChecking] = useState(true);
  const { index5, jobs1 } = useFilterStore();
  const [showIcons, setShowIcons] = useState(false);



  const router = useRouter();
  const params = useLocalSearchParams();




  const fetchJobs = async (pageNum = 1, refresh = false) => {
  try {
    if (refresh) setRefreshing(true);
    else if (pageNum === 1) setLoading(true);

     const queryParams = new URLSearchParams({
      page: pageNum,
      limit: 5,
      searchQuery,
      location: index5.location || "",
      income: jobs1.income || "",
      workingHours: jobs1.workingHours || "",
      paymentType: jobs1.paymentType || "",
      type: selectedType || "",
    });


    const res = await apiFetch(`/jobs?${queryParams.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });


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
        router.replace("/login"); // مستقیم به login
        return;
      }

      const res = await apiFetch("/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        await AsyncStorage.setItem("accessToken", data.accessToken);
        fetchJobs();
      } else {
        await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
        router.replace("/(auth)/login");
      }
    } catch (err) {
      router.replace("/(auth)login");
    } finally {
      setChecking(false);
    }
  };

  checkToken();



  }, []);

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
  {item.image && (
    <Image source={{ uri: item.image }} style={styles.propertyImage} contentFit="cover" />
  )}
</View>
</View>


      </TouchableOpacity>
    </Link>
  );

  if (loading) return <Loader />;

 return (
  <View style={styles.container}>
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
      ListHeaderComponent={
  <View>
{/* دکمه منو */}
  <TouchableOpacity
    style={carFormStyles.menuButton}
    onPress={() => setShowIcons(!showIcons)}
  >
    <Ionicons name="menu-outline" size={28} color="black" />
    <Text style={carFormStyles.menuText}>همه آگهی‌ها</Text>
  </TouchableOpacity>

  {/* بخش آیکون‌ها فقط وقتی showIcons=true */}
  {showIcons && (
    <View style={carFormStyles.container}>
      <View style={carFormStyles.row1}>
        
        {/* آیکون املاک */}
        <TouchableOpacity
          onPress={() => router.push("/page/properties")}
          style={carFormStyles.touchable1}
        >
          <Ionicons name="home-outline" size={35} color={COLORS.primary} />
          <View style={carFormStyles.underline} />
          <Text style={carFormStyles.label}>املاک</Text>
        </TouchableOpacity>

        {/* آیکون وسایل نقلیه */}
        <TouchableOpacity
          onPress={() => router.push("/page/car")}
          style={carFormStyles.touchable1}
        >
          <Ionicons name="car-outline" size={35} color={COLORS.primary} />
          <View style={carFormStyles.underline} />
          <Text style={carFormStyles.label}>وسایل نقلیه</Text>
        </TouchableOpacity>

        {/* آیکون پوشاک */}
        <TouchableOpacity
          onPress={() => router.push("/page/cloutes")}
          style={carFormStyles.touchable1}
        >
          <Ionicons name="shirt-outline" size={35} color={COLORS.primary} />
          <View style={carFormStyles.underline} />
          <Text style={carFormStyles.label}>پوشاک</Text>
        </TouchableOpacity>

        {/* آیکون خانه و آشپزخانه */}
        <TouchableOpacity
          onPress={() => router.push("/page/kitchen")}
          style={carFormStyles.touchable1}
        >
          <Ionicons name="cube-outline" size={35} color={COLORS.primary} />
          <View style={carFormStyles.underline} />
          <Text style={carFormStyles.label}>خانه و آشپزخانه</Text>
        </TouchableOpacity>

        {/* آیکون خوراکی‌ها */}
        <TouchableOpacity
          onPress={() => router.push("/page/eat")}
          style={carFormStyles.touchable1}
        >
          <Ionicons name="fast-food-outline" size={35} color={COLORS.primary} />
          <View style={carFormStyles.underline} />
          <Text style={carFormStyles.label}>خوراکی‌ها</Text>
        </TouchableOpacity>

      </View>
    </View>
  )}


  
    {/* بخش ورودی متن و ولایت */}
    <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 10 }}>
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
            router.push({
              pathname: "/page/select-location",
              params: { section: "jobs" },
            })
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
  <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 10 }}>
      <TouchableOpacity
       style={carFormStyles.touchable}
        onPress={() =>
          router.push({
            pathname: "/filter",
            params: { type: "income1" },
          })
        }
      >
        <Text>{jobs1.income || "income"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
       style={carFormStyles.touchable}
        onPress={() =>
          router.push({
            pathname: "/filter",
            params: { type: "workingHours1" },
          })
        }
      >
        <Text>{jobs1.workingHours || "hours"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={carFormStyles.touchable}
        onPress={() =>
          router.push({
            pathname: "/filter",
            params: { type: "paymentType1" },
          })
        }
      >
        <Text>{jobs1.paymentType || "payment"}</Text>
      </TouchableOpacity>
    </View>

    {/* دکمه جستجو */}
    {(searchQuery.length > 0 ||
      index5.location ||
      jobs1.income ||
      jobs1.workingHours ||
      jobs1.paymentType) && (
      <TouchableOpacity
        style={styles.button}
        onPress={() => fetchJobs(1, true)}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="search" size={22} color={COLORS.black} />
          <Text style={styles.buttonText}>جستجو کنید</Text>
        </View>
      </TouchableOpacity>
    )}
  </View>
}

      ListFooterComponent={
        addMore && jobs.length > 0 ? (
          <ActivityIndicator
            style={styles.footerLoader}
            size="small"
            color={COLORS.primary}
          />
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons
            name="briefcase-outline"
            size={60}
            color={COLORS.textSecondary}
          />
          <Text style={styles.emptyText}>هنوز آگهی شغلی اضافه نشده</Text>
        </View>
      }
    />
  </View>
);
}

