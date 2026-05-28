import { View, Text, TouchableOpacity, FlatList, ActivityIndicator,Modal, RefreshControl, TextInput } from 'react-native';
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
  const [showKitchenSearchButton, setShowKitchenSearchButton] = useState(false);
  const [showKitchenFilters, setShowKitchenFilters] = useState(false);



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

useEffect(() => {
  if (
    kitchen1.location ||
    titleFilter ||
    kitchen1.dimensions ||
    kitchen1.texture ||
    kitchen1.model ||
    kitchen1.category ||
    kitchen1.status
  ) {
    setShowKitchenSearchButton(true);
  } else {
    setShowKitchenSearchButton(false);
  }
}, [
  kitchen1.location,
  titleFilter,
  kitchen1.dimensions,
  kitchen1.texture,
  kitchen1.model,
  kitchen1.category,
  kitchen1.status
]);

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

       <Modal
      visible={showKitchenFilters}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowKitchenFilters(false)}
    >
      <View style={{ flex: 1, justifyContent: "flex-start", backgroundColor: "rgba(0,0,0,0.3)" }}>
        <View
          style={{
            height: "100%", // نصف صفحه
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
          }}
        >
          {/* دکمه بستن */}
          <TouchableOpacity onPress={() => setShowKitchenFilters(false)} style={{ alignSelf: "flex-start", marginBottom: 15, }}>
             <Ionicons name="close" size={35} color={COLORS.black} />
          </TouchableOpacity>

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

        {/* ردیف دوم: فیلترها */}
        <View style={carFormStyles.row}>
          <TouchableOpacity
            style={carFormStyles.touchable}
            onPress={() => router.push({ pathname: "/filter", params: { type: "model" } })}
          >
            <Text style={{ color: kitchen1.model ? COLORS.black : COLORS.placeholderText, fontSize: 16 }}>
              {kitchen1.model || "مدل"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={carFormStyles.touchable}
            onPress={() => router.push({ pathname: "/filter", params: { type: "category" } })}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: kitchen1.category ? COLORS.black : COLORS.placeholderText }}
            >
              {kitchen1.category || "بخش ها"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={carFormStyles.touchable}
            onPress={() => router.push({ pathname: "/filter", params: { type: "status" } })}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
            style={{ color: kitchen1.status ? COLORS.black : COLORS.placeholderText }}>
              {kitchen1.status || "وضعیت"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={carFormStyles.touchable}
            onPress={() => router.push({ pathname: "/filter", params: { type: "texture" } })}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: kitchen1.texture ? COLORS.black : COLORS.placeholderText, fontSize: 15 }}
            >
              {kitchen1.texture || "جنس"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={carFormStyles.touchable}
            onPress={() => router.push({ pathname: "/filter", params: { type: "dimensions" } })}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: kitchen1.dimensions ? COLORS.black : COLORS.placeholderText, fontSize: 16 }}
            >
              {kitchen1.dimensions || "ابعاد"}
            </Text>
          </TouchableOpacity>
        </View>

     
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              fetchItems(1, true);
              setShowKitchenSearchButton(false);
              setShowKitchenFilters(false)
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="search" size={22} color={COLORS.white} />
              <Text style={styles.buttonText}>جستجو کنید</Text>
            </View>
          </TouchableOpacity>
      

</View>
</View>
</Modal>
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
        stickyHeaderIndices={[0]}
     ListHeaderComponent={
  <>
    {/* دکمه باز/بستن فیلترها */}
    <TouchableOpacity
      style={styles.filterToggleButton}
      onPress={() => setShowKitchenFilters(!showKitchenFilters)}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Ionicons name="filter" size={22} color={COLORS.black} />
        <Text style={styles.buttonText1}>
          {showKitchenFilters ? "بستن فیلترها" : "نمایش فیلترها"}
        </Text>
      </View>
    </TouchableOpacity>
  </>
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

