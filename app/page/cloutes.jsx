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

export default function CloutesList() {
  const { accessToken } = useAuthStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [addMore, setAddMore] = useState(true);
  const [titleFilter, setTitleFilter] = useState("");

  const { Cloutes2 } = useFilterStore();

const router = useRouter();

  const fetchItems = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

       // گرفتن فیلترها از state و store
      const queryParams = new URLSearchParams({
      page: pageNum.toString(),
      limit: "5",
      title: titleFilter || "",
      location: Cloutes2.location || "",
      cloutesModel: Cloutes2.cloutesModel || "",
      cloutesTexture: Cloutes2.cloutesTexture || "",
      cloutesStatus: Cloutes2.cloutesStatus || "",
    });



     const res = await apiFetch(`/cloutes?${queryParams.toString()}`, {
     headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در گرفتن آگهی‌های پوشاک");

      setItems(pageNum === 1 || refresh ? (data.cloutes || []) : [...items, ...(data.cloutes || [])]);
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
        pathname: "/details/cloutes-details",
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
    {/* Inputs row */}
    <View style={carFormStyles.row}>
      <TextInput
        style={carFormStyles.textInput}
        placeholder="عنوان پوشاک را بنویسید"
        placeholderTextColor={COLORS.placeholderText}
        value={titleFilter}
        onChangeText={setTitleFilter}
      />
        <TouchableOpacity
                 style={carFormStyles.touchable}
                onPress={() =>
                  router.push({
                    pathname: "/page/select-location",
                    params: { section: "clothes2" },
                  })
                }
              >
                <Text style={{ color: Cloutes2.location ? COLORS.black : COLORS.placeholderText, fontSize: 16 }}>
                  {Cloutes2.location || "ولایت"}
                </Text>
              </TouchableOpacity>
    </View>

<View style={carFormStyles.row}>

    <TouchableOpacity
   style={carFormStyles.touchable}
  onPress={() =>
    router.push({
      pathname: "/filter",
      params: { type: "cloutesModel" }, // 👈 مسیر برگشت
    })
  }
>
  <Text>{Cloutes2.cloutesModel || "مدل"}</Text>
</TouchableOpacity>


 <TouchableOpacity
    style={carFormStyles.touchable}
  onPress={() =>
    router.push({
      pathname: "/filter",
      params: { type: "cloutesTexture" }, // 👈 مسیر برگشت
    })
  }
>
  <Text>{Cloutes2.cloutesTexture || "جنس پارچه"}</Text>
</TouchableOpacity>

<TouchableOpacity
   style={carFormStyles.touchable}
  onPress={() =>
    router.push({
      pathname: "/filter",
      params: { type: "cloutesStatus" }, // 👈 مسیر برگشت
    })
  }
>
  <Text>{Cloutes2.cloutesStatus || "وضعیت"}</Text>
</TouchableOpacity>
</View>
 

    {/* Search button */}
    {(Cloutes2?.cloutesModel ||
      Cloutes2?.cloutesTexture ||
      Cloutes2?.cloutesStatus ||
      Cloutes2?.location || 
      titleFilter) && (
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
            <Ionicons name='shirt-outline' size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}> هنوز آگهی پوشاک اضافه نشده</Text>
          </View>
        }
      />
    </View>
  );
}

