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

export default function HomeAndKitchenList() {
  const { accessToken } = useAuthStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [addMore, setAddMore] = useState(true);
  const [titleFilter, setTitleFilter] = useState("");

   const router = useRouter();
   const { kitchen1 } = useFilterStore();

 const fetchItems = async (pageNum = 1, refresh = false) => {
  try {
    if (refresh) setRefreshing(true);
    else if (pageNum === 1) setLoading(true);

   const queryParams = new URLSearchParams({
  page: pageNum.toString(),
  limit: "5",
  ...(titleFilter ? { title: titleFilter } : {}),
  ...(kitchen1.location ? { location: kitchen1.location } : {}),
  ...(kitchen1.model ? { model: kitchen1.model } : {}),
  ...(kitchen1.category ? { category: kitchen1.category } : {}),
  ...(kitchen1.status ? { status: kitchen1.status } : {}),
  ...(kitchen1.texture ? { texture: kitchen1.texture } : {}),
  ...(kitchen1.dimensions ? { dimensions: kitchen1.dimensions } : {}),
});

    const res = await apiFetch(`/kitchen?${queryParams.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "خطا در گرفتن آگهی‌های خانه و آشپزخانه");

    setItems(pageNum === 1 || refresh ? (data.homes || []) : [...items, ...(data.homes || [])]);
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
        pathname: "/details/kitchen-details",
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
              {item.status && <Text style={styles.propertyInfo}>وضعیت: {item.status}</Text>}
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
  {/* ردیف اول: عنوان و ولایت */}
 <View style={carFormStyles.row}>
    <TextInput
       style={carFormStyles.textInput}
      placeholder="عنوان وسیله خانه یا آشپزخانه را بنویسید"
      placeholderTextColor={COLORS.placeholderText}
      value={titleFilter}
      onChangeText={setTitleFilter}
    />
    <TouchableOpacity
     style={carFormStyles.touchable}
      onPress={() =>
        router.push({
          pathname: "/page/select-location",
          params: { section: "kitchen1" },
        })
      }
    >
      <Text
        style={{
          color: kitchen1.location ? COLORS.black : COLORS.placeholderText,
          fontSize: 16,
        }}
      >
        {kitchen1.location || "ولایت"}
      </Text>
    </TouchableOpacity>
  </View>

  {/* ردیف دوم: چهار فیلد فیلتر */}
 <View style={carFormStyles.row}>
    <TouchableOpacity
      style={carFormStyles.touchable}
      onPress={() =>
        router.push({ pathname: "/filter", params: { type: "model" } })
      }
    >
      <Text>{kitchen1.model || "مدل"}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={carFormStyles.touchable}
      onPress={() =>
        router.push({ pathname: "/filter", params: { type: "category" } })
      }
    >
      <Text>{kitchen1.category || "دسته‌بندی"}</Text>
    </TouchableOpacity>

    <TouchableOpacity
    style={carFormStyles.touchable}
      onPress={() =>
        router.push({ pathname: "/filter", params: { type: "status" } })
      }
    >
      <Text>{kitchen1.status || "وضعیت"}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={carFormStyles.touchable}
      onPress={() =>
        router.push({ pathname: "/filter", params: { type: "texture" } })
      }
    >
      <Text>{kitchen1.texture || "جنس"}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={carFormStyles.touchable}
      onPress={() =>
        router.push({ pathname: "/filter", params: { type: "dimensions" } })
      }
    >
      <Text>{kitchen1.dimensions || "ابعاد"}</Text>
    </TouchableOpacity>
  </View>

  {/* دکمه جستجو زیر چهار فیلد */}
  {(kitchen1.location ||
    titleFilter ||
    kitchen1.dimensions ||
    kitchen1.texture ||
    kitchen1.model ||
    kitchen1.category ||
    kitchen1.status) && (
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
            <Ionicons name='home-outline' size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}> هنوز آگهی لوازم خانه و آشپزخانه اضافه نشده</Text>
          </View>
        }
      />
    </View>
  );
}

