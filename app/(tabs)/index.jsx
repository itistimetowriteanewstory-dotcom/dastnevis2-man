import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, TextInput } from 'react-native'
import { Image } from "expo-image";
import { useAuthStore } from '../../store/authStore';
import { useEffect, useState } from 'react';
import styles from "../../assets/styles/home.styles";
import { API_URL } from '../../colectionColor/api';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../colectionColor/colors';
import { formatPublishDate } from '../../lib/utils';
import Loader from '../../component/Loader';
import { Link } from 'expo-router';
import { Picker } from '@react-native-picker/picker';


export default function Home() {
  const {token} = useAuthStore();
   const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [addMore, setAddMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
const [locationFilter, setLocationFilter] = useState("");
 const [filterType, setFilterType] = useState("all");

const fetchAllData = async (pageNum = 1, refresh = false) => {
  try {
    if (refresh) setRefreshing(true);
    else if (pageNum === 1) setLoading(true);

    // درخواست همزمان به دو API
    const [jobsRes, propsRes] = await Promise.all([
      fetch(`${API_URL}/jobs?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_URL}/properties?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const jobsData = await jobsRes.json();
    const propsData = await propsRes.json();

    if (!jobsRes.ok) throw new Error(jobsData.message || "خطا در گرفتن آگهی‌های شغلی");
    if (!propsRes.ok) throw new Error(propsData.message || "خطا در گرفتن آگهی‌های ملکی");

    // ترکیب دو لیست و مرتب‌سازی بر اساس تاریخ
    const combined = [...jobsData.jobs, ...propsData.properties].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setJobs(pageNum === 1 || refresh ? combined : [...jobs, ...combined]);
   setAddMore(pageNum < jobsData.totalPages || pageNum < propsData.totalPages);
    setPage(pageNum);
  } catch (error) {
    console.error("fetch error:", error);
  } finally {
    if (refresh) setRefreshing(false);
    else setLoading(false);
  }
};


 

  useEffect(() =>{
    fetchAllData()
  },[]);

  const handleLoadMore = async () => {
   if(addMore && !loading && !refreshing) {
    await fetchAllData(page + 1);
   }
  };

   const filteredjobs = jobs.filter(job => {
    const matchesTitle = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter
      ? (job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase()))
      : true;

    const isJob = !!job.income;
    const matchesType =
      filterType === "all" ||
      (filterType === "jobs" && isJob) ||
      (filterType === "properties" && !isJob);

    return matchesTitle && matchesLocation && matchesType;
  });


 
const renderItem = ({ item }) => {
  const isJob = !!item.income; // اگر income داشت یعنی شغل است

  return (
    <Link
      href={{
        pathname: isJob ? "/job-details" : "/property-details",
        params: { data: JSON.stringify(item) }, // 👈 ارسال کل آیتم به صفحه جزئیات
      }}
      asChild
    >
      <TouchableOpacity activeOpacity={0.5}>
        <View style={styles.jobCard}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image source={{ uri: item.user?.profileImage }} style={styles.avatar} />
              <Text style={styles.username}>{item.user?.username}</Text>
            </View>
          </View>

          <Text style={styles.jobTitle}>{item.title}</Text>

          <View style={styles.jobContent}>
            {/* 👇 عکس شغل یا ملک */}
            {isJob && item.image && (
              <View style={styles.jobImageContainer}>
                <Image source={{ uri: item.image }} style={styles.jobImage} contentFit="cover" />
              </View>
            )}

          {!isJob && item.image && (
          <View style={styles.jobImageContainer}>
           <Image source={{ uri: item.image }} style={styles.jobImage} contentFit="cover" />
         </View>
           )}

            <View style={styles.jobDetails}>
              {item.location && <Text style={styles.jobTitle}>ولایت: {item.location}</Text>}


              {isJob && item.income && (
                <Text style={styles.jobTitle}>معاش: {item.income}.افغانی</Text>
              )}

              {!isJob && (
                <>
                  {item.price && <Text style={styles.jobTitle}>قیمت فروش: {item.price}.افغانی</Text>}
                  {item.rentPrice && <Text style={styles.jobTitle}>اجاره: {item.rentPrice}.افغانی</Text>}
                  {item.mortgagePrice && <Text style={styles.jobTitle}>رهن: {item.mortgagePrice}.افغانی</Text>}
                </>
              )}

              {item.phoneNumber && (
                <Text style={styles.jobTitle}>نمبر تلفون: {item.phoneNumber}</Text>
              )}

              <Text style={styles.caption} numberOfLines={2} ellipsizeMode="tail">
                {item.description || item.caption}
              </Text>

              <Text style={styles.date}>
                ثبت شده در تاریخ {formatPublishDate(item.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};


  if (loading) return <Loader />;



  return (
    <View style={styles.container}>
      <FlatList 
      data={filteredjobs}
    
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    
refreshControl={
  <RefreshControl 
   refreshing={refreshing}
   onRefresh={()=> fetchAllData(1, true)}
   colors={[COLORS.primary]}
   tintColor={COLORS.primary}
  />
}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}

      
      ListHeaderComponent={
 <View>
    {/* بخش سرچ و فیلتر */}
    <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
      {/* جستجو بر اساس عنوان */}
      <TextInput
        style={{
          backgroundColor: COLORS.background,
          padding: 10,
          borderRadius: 8,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: COLORS.textSecondary
        }}
        placeholder="کار مورد نظر خود را بنویسید"
        placeholderTextColor={COLORS.placeholderText}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* فیلتر بر اساس شهر */}
      <TextInput
        style={{
          backgroundColor: COLORS.background,
          padding: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: COLORS.textSecondary
        }}
        placeholder="ولایت خود را بنویسید"
        placeholderTextColor={COLORS.placeholderText}
        value={locationFilter}
        onChangeText={setLocationFilter}
      />

      {/* 👇 دراپ‌داون انتخاب نوع */}
            <Picker
              selectedValue={filterType}
              onValueChange={(value) => setFilterType(value)}
              style={{
                backgroundColor: COLORS.background,
                borderWidth: 1,
                borderColor: COLORS.textSecondary,
                borderRadius: 8,
                marginTop: 8
              }}
            >
              <Picker.Item label="همه آگهی‌ها" value="all" />
              <Picker.Item label="فقط کارها" value="jobs" />
              <Picker.Item label="فقط املاک" value="properties" />
            </Picker>

    </View>
  </View>
      }
         

      
ListFooterComponent ={
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
          <Ionicons name='briefcase-outline' size={60} color={COLORS.textSecondary}/>
          <Text style={styles.emptyText}> هنوز کاری اضافه نشده</Text>
          <Text style={styles.emptySubtext}> اولین نفری باشید که یک موقعیت شغلی به برنامه اضافه میکنید </Text>
           </View>
      }
      />
     
    </View>
  )
}