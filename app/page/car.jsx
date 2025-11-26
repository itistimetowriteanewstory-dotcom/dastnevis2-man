import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { Image } from "expo-image";
import { useAuthStore } from '../../store/authStore';
import { useEffect, useState } from 'react';
import styles from "../../assets/styles/home.styles";
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../colectionColor/colors';
import { formatPublishDate } from '../../lib/utils';
import Loader from '../../component/Loader';
import { Link } from 'expo-router';
import { apiFetch } from "../../store/apiClient";
import { useRouter } from "expo-router";
import { useFilterStore } from "../../store/fileStore";
import { carFormStyles } from "../../assets/styles/CarFormStyles";




export default function Cars() {
  const { accessToken } = useAuthStore();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [addMore, setAddMore] = useState(true);
 


  const router = useRouter();
  

  const { car1, setCar1 } = useFilterStore();



 const fetchCars = async (pageNum = 1, refresh = false) => {
  try {
    if (refresh) setRefreshing(true);
    else if (pageNum === 1) setLoading(true);

    const queryParams = new URLSearchParams({
       page: pageNum,
      limit: 5,
      location: car1.location || "",
      model: car1.model || "",
      adType: car1.adType || "",
      title: car1.title || "",

    });

    const res = await apiFetch(`/car?${queryParams.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "خطا در گرفتن آگهی‌های خودرو");

    setCars(pageNum === 1 || refresh ? data.cars : [...cars, ...data.cars]);
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
    fetchCars();
  }, []);

  const handleLoadMore = async () => {
    if (addMore && !loading && !refreshing) {
      await fetchCars(page + 1);
    }
  };



  const renderItem = ({ item }) => (
    <Link
      href={{
        pathname: "/details/car-details",
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
              {item.model && <Text style={styles.propertyInfo}>مدل: {item.model}</Text>}
              {item.price && <Text style={styles.propertyInfo}>قیمت: {item.price}</Text>}

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
      {/* لیست آگهی‌ها */}
      <FlatList
        data={cars}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchCars(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={{ marginBottom: 12 }}>
            {/* فیلدهای ولایت و عنوان */}
         
  <View style={carFormStyles.row}>
    <TextInput
      style={carFormStyles.textInput}
      placeholder="عنوان"
      placeholderTextColor={COLORS.placeholderText}
      value={car1.title}
      onChangeText={(val) => setCar1({ title: val })}
    />

    <TouchableOpacity
      style={carFormStyles.touchable}
      onPress={() =>
        router.push({
          pathname: "/page/select-location",
          params: { section: "car1" },
        })
      }
    >
      <Text
        style={[
          carFormStyles.touchableText,
          { color: car1.location ? COLORS.black : COLORS.placeholderText },
        ]}
      >
        {car1.location || "ولایت"}
      </Text>
    </TouchableOpacity>
  </View>

  <View style={carFormStyles.row}>
    <TouchableOpacity
      style={carFormStyles.touchable}
      onPress={() =>
        router.push({
          pathname: "/filter",
          params: { type: "carAdType" },
        })
      }
    >
      <Text style={carFormStyles.touchableText}>
        {car1.adType || "نوع آگهی"}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={carFormStyles.touchable}
      onPress={() =>
        router.push({
          pathname: "/filter",
          params: { type: "carModel" },
        })
      }
    >
      <Text style={carFormStyles.touchableText}>
        {car1.model || "مدل"}
      </Text>
    </TouchableOpacity>
  </View>

            {(car1.title || car1.location || car1.model || car1.adType) && (
              <TouchableOpacity style={styles.button} onPress={() => fetchCars(1, true)}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="search" size={22} color={COLORS.black} />
                  <Text style={styles.buttonText}>جستجو کنید</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        }
        ListFooterComponent={
          addMore && cars.length > 0 ? (
            <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary} />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}> هنوز آگهی خودرو اضافه نشده</Text>
          </View>
        }
      />
    </View>
  );
}

