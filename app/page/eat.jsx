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
import { useFilterStore } from "../../store/fileStore";
import { useRouter } from "expo-router";
import { carFormStyles } from "../../assets/styles/CarFormStyles";

export default function EatList() {
  const { accessToken } = useAuthStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [addMore, setAddMore] = useState(true);
  const [titleFilter, setTitleFilter] = useState("");


  const router = useRouter();
   const { eat1 } = useFilterStore();


  



  const fetchItems = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

       const queryParams = new URLSearchParams({
       page: pageNum.toString(),
       limit: "5",
       title: titleFilter || "",
       location: eat1.location || "",
       });

    const res = await apiFetch(`/eat?${queryParams.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    });



      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در گرفتن آگهی‌های خوراکی");

     setItems(pageNum === 1 || refresh ? (data.eats || []) : [...items, ...(data.eats || [])]);
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
    fetchItems();
  }, []);

  const handleLoadMore = async () => {
    if (addMore && !loading && !refreshing) {
      await fetchItems(page + 1);
    }
  };

 

  const renderItem = ({ item }) => (
    <Link
      href={{
        pathname: "/details/eat-details",
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
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchItems(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
       ListHeaderComponent={
  <View style={{ marginBottom: 12 }}>
    {/* Inputs row */}
   <View style={carFormStyles.row}>
      <TextInput
       style={carFormStyles.textInput}
        placeholder="عنوان خوراکی را بنویسید"
        placeholderTextColor={COLORS.placeholderText}
        value={titleFilter}
        onChangeText={setTitleFilter}
      />
      <TouchableOpacity
        style={carFormStyles.touchable}
        onPress={() =>
          router.push({
            pathname: "/page/select-location",
            params: { section: "eat1" },
          })
        }
      >
        <Text
          style={{
            color: eat1.location ? COLORS.black : COLORS.placeholderText,
            fontSize: 16,
          }}
        >
          {eat1.location || "ولایت"}
        </Text>
      </TouchableOpacity>
    </View>

    {/* Search button */}
    {(eat1?.location || titleFilter) && (
      <TouchableOpacity style={styles.button} onPress={() => fetchItems(1, true)}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="search" size={22} color={COLORS.black} />
          <Text style={styles.buttonText}>جستجو کنید</Text>
        </View>
      </TouchableOpacity>
    )}
  </View>
}


        ListFooterComponent={
          addMore && items.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="small"
              color={COLORS.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name='fast-food-outline' size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}> هنوز آگهی خوراکی اضافه نشده</Text>
          </View>
        }
      />
    </View>
  );
}

