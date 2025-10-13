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
import { API_URL } from '../../colectionColor/api';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../colectionColor/colors';
import { formatPublishDate } from '../../lib/utils';
import Loader from '../../component/Loader';
import { Link, useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';

export default function Jobs() {
  const { token } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [addMore, setAddMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedType, setSelectedType] = useState("jobs");
  const router = useRouter();

  const fetchJobs = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const res = await fetch(`${API_URL}/jobs?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
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
    fetchJobs();
  }, []);

  const handleLoadMore = async () => {
    if (addMore && !loading && !refreshing) {
      await fetchJobs(page + 1);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesTitle = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter
      ? (job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase()))
      : true;
    return matchesTitle && matchesLocation;
  });

  const renderItem = ({ item }) => (
    <Link
      href={{
        pathname: "/job-details",
        params: { data: JSON.stringify(item) },
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
            {item.image && (
              <View style={styles.jobImageContainer}>
                <Image source={{ uri: item.image }} style={styles.jobImage} contentFit="cover" />
              </View>
            )}

            <View style={styles.jobDetails}>
              {item.location && <Text style={styles.jobTitle}>ولایت: {item.location}</Text>}
              {item.income && <Text style={styles.jobTitle}>معاش: {item.income} افغانی</Text>}
              {item.phoneNumber && <Text style={styles.jobTitle}>نمبر تلفون: {item.phoneNumber}</Text>}

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

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredJobs}
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
          <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>

            <TextInput
              style={{
                backgroundColor: COLORS.background,
                padding: 10,
                borderRadius: 8,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: COLORS.textSecondary
              }}
              placeholder="کار مورد نظر خودرا بنویسید"
              placeholderTextColor={COLORS.placeholderText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <TextInput
              style={{
                backgroundColor: COLORS.background,
                padding: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: COLORS.textSecondary,
                marginTop: 8
              }}
              placeholder="ولایت خود را بنویسید"
              placeholderTextColor={COLORS.placeholderText}
              value={locationFilter}
              onChangeText={setLocationFilter}
            />

            <RNPickerSelect
              onValueChange={(value) => {
                setSelectedType(value);
                if (value === "properties") {
                  router.push("/properties");
                }
              }}
              items={[
                { label: 'آگهی‌های کار', value: 'jobs', color: COLORS.black },
                { label: 'آگهی‌های ملک', value: 'properties', color: COLORS.black }
              ]}
              placeholder={{
              label: 'نوع آگهی را انتخاب کنید', // 👈 متن دلخواه فارسی
              value: null,
              }}
              style={{
                inputIOS: {
                  backgroundColor: '#f9e6ba',
                  color: COLORS.black,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: COLORS.textSecondary,
                  marginTop: 8
                },
                inputAndroid: {
                  backgroundColor: '#f9e6ba',
                  color: COLORS.black,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: COLORS.textSecondary,
                  marginTop: 8
                },
                 placeholder: {
                 color: COLORS.black
                 }
              }}
            />
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
            <Ionicons name='briefcase-outline' size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}> هنوز آگهی شغلی اضافه نشده</Text>
          </View>
        }
      />
    </View>
  );
}

