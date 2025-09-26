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

export default function Home() {
  const {token} = useAuthStore();
   const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [addMore, setAddMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
const [locationFilter, setLocationFilter] = useState("");



  const fetchJobs = async (pageNum=1, refresh=false) => {

try {
  if(refresh) setRefreshing(true);
  else if(pageNum===1) setLoading(true);

const response = await fetch(`${API_URL}/jobs?page=${pageNum}&limit=5`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const data = await response.json();
if(!response.ok) throw new Error(data.message || "failed to fetch jobs ");




const uniqueJobs =
  refresh || pageNum === 1
    ? data.jobs
    : Array.from(
        new Set([...jobs, ...data.jobs].map((job) => job._id))
      ).map((id) =>
        [...jobs, ...data.jobs].find((job) => job._id === id)
      );

setJobs(uniqueJobs);



setAddMore(pageNum < data.totalPages);
setPage(pageNum)

} catch (error) {
 
}finally{
  if(refresh) setRefreshing(false);
  else setLoading(false);
}

  };

  useEffect(() =>{
    fetchJobs()
  },[]);

  const handleLoadMore = async () => {
   if(addMore && !loading && !refreshing) {
    await fetchJobs(page + 1);
   }
  };

const filteredjobs = jobs.filter(job => {
  const matchesTitle = job.title.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesLocation = locationFilter
    ? (job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase()))
    : true;
  return matchesTitle && matchesLocation;
});

  const renderItem = ({ item }) => (
  <Link
    href={{
      pathname: '/job-details',
      params: { job: JSON.stringify(item) },
    }}
    asChild
  >

    <TouchableOpacity activeOpacity={0.5}>
      <View style={styles.jobCard}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: item.user?.profileImage }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{item.user?.username}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.jobTitle}>{item.title}</Text>

        {/* Content (image + details) */}
        <View style={styles.jobContent}>
          <View style={styles.jobImageContainer}>
            <Image source={item.image} style={styles.jobImage} contentFit="cover" />
          </View>

          <View style={styles.jobDetails}>
           

            {item.location && (
              <Text style={styles.jobTitle}>ولایت: {item.location}</Text>
            )}

            {item.income && (
              <Text style={styles.jobTitle}>معاش: افغانی {item.income}</Text>
            )}

             {item.phoneNumber && (
              <Text style={styles.jobTitle}>نمبر تلفون: {item.phoneNumber}</Text>
            )}

            <Text style={styles.caption} numberOfLines={2} ellipsizeMode="tail">
              {item.caption}
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



  if (loading) return <Loader />;



  return (
    <View style={styles.container}>
      <FlatList 
      data={searchQuery || locationFilter ? filteredjobs : jobs}
    
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    
refreshControl={
  <RefreshControl 
   refreshing={refreshing}
   onRefresh={()=> fetchJobs(1, true)}
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
          backgroundColor: COLORS.black,
          padding: 10,
          borderRadius: 8,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: COLORS.black
        }}
        placeholder="کار مورد نظر خود را بنویسید"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* فیلتر بر اساس شهر */}
      <TextInput
        style={{
          backgroundColor: COLORS.black,
          padding: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: COLORS.black
        }}
        placeholder="ولایت خود را بنویسید"
        value={locationFilter}
        onChangeText={setLocationFilter}
      />
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