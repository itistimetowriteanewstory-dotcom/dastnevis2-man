import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, TextInput } from 'react-native'
import { Image } from "expo-image";
import { useAuthStore } from '../store/authStore';
import { useEffect, useState } from 'react';
import styles from "../assets/styles/home.styles";
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../colectionColor/colors';
import { formatPublishDate } from '../lib/utils';
import Loader from '../component/Loader';
import { Link } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select'; 
import { apiFetch } from "../store/apiClient";

export default function Properties() {
  const {accessToken} = useAuthStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [addMore, setAddMore] = useState(true);
  const [locationFilter, setLocationFilter] = useState("");
  const [adType, setAdType] = useState("all"); // 👈 نوع آگهی

  const fetchProperties = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const res = await apiFetch(`/properties?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در گرفتن آگهی‌های ملکی");

      setProperties(pageNum === 1 || refresh ? data.properties : [...properties, ...data.properties]);
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
    fetchProperties();
  }, []);

  const handleLoadMore = async () => {
    if(addMore && !loading && !refreshing) {
      await fetchProperties(page + 1);
    }
  };

  // 👇 فیلتر بر اساس ولایت و نوع آگهی
  const filteredProperties = properties.filter(item => {
    const matchesLocation = locationFilter
      ? (item.location && item.location.toLowerCase().includes(locationFilter.toLowerCase()))
      : true;

    let matchesType = true;
    if (adType === "sell") matchesType = !!item.price;
    if (adType === "rent") matchesType = !!item.rentPrice && !item.mortgagePrice;
    if (adType === "mortgage") matchesType = !!item.mortgagePrice && !item.rentPrice;
    if (adType === "rent_mortgage") matchesType = !!item.rentPrice && !!item.mortgagePrice;

    return matchesLocation && matchesType;
  });

  const renderItem = ({ item }) => (
    <Link
      href={{
        pathname: "/property-details",
        params: { data: JSON.stringify(item) },
      }}
      asChild
    >
      <TouchableOpacity activeOpacity={0.5}>
        <View style={styles.propertyCard}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image source={{ uri: item.user?.profileImage }} style={styles.avatar} />
              <Text style={styles.username}>{item.user?.username}</Text>
            </View>
          </View>

          {item.image && (
            <Image source={{ uri: item.image }} style={styles.propertyImage} contentFit="cover" />
          )}

          <View style={styles.propertyContent}>
            <Text style={styles.propertyTitle}>{item.title}</Text>
            {item.location && <Text style={styles.propertyInfo}>ولایت: {item.location}</Text>}

            {item.price && <Text style={styles.propertyInfo}>نوع آگهی: فروش</Text>}
            {item.rentPrice && item.mortgagePrice && (
              <Text style={styles.propertyInfo}>نوع آگهی: گرو و کرایه</Text>
            )}
            {item.rentPrice && !item.mortgagePrice && (
              <Text style={styles.propertyInfo}>نوع آگهی: کرایه</Text>
            )}
            {item.mortgagePrice && !item.rentPrice && (
              <Text style={styles.propertyInfo}>نوع آگهی: گرو</Text>
            )}

            <Text style={styles.caption} numberOfLines={2} ellipsizeMode="tail">
              {item.description || item.caption}
            </Text>

            <Text style={styles.propertyDate}>
              ثبت شده در تاریخ {formatPublishDate(item.createdAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <FlatList 
        data={filteredProperties}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={()=> fetchProperties(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
            
           <RNPickerSelect
  onValueChange={(value) => setAdType(value)}
  value={adType}
  placeholder={{
    label: 'نوع آگهی را انتخاب کنید',
    value: null
  }}
  items={[
    { label: 'همه آگهی‌ها', value: 'all'},
    { label: 'فروش', value: 'sell'},
    { label: 'کرایه', value: 'rent'},
    { label: 'گرو', value: 'mortgage' },
    { label: 'گرو و کرایه', value: 'rent_mortgage'}
  ]}
  useNativeAndroidPickerStyle={false}
  style={{
    inputIOS: {
      backgroundColor: '#f9e6ba',
      color: COLORS.black,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.textSecondary,
      marginBottom: 8
    },
    inputAndroid: {
      backgroundColor: '#f9e6ba',
      color: COLORS.black,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.textSecondary,
      marginBottom: 8
    },
    placeholder: {
      color: COLORS.placeholderText
    }
  }}
/>

            {/* 👇 اینپوت ولایت (همونطور که خواستی بمونه) */}
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

          </View>
        }
        ListFooterComponent={
          addMore && properties.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="small"
              color={COLORS.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name='home-outline' size={60} color={COLORS.textSecondary}/>
            <Text style={styles.emptyText}> هنوز آگهی ملکی اضافه نشده</Text>
          </View>
        }
      />
    </View>
  )
}

