import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, TextInput } from 'react-native'
import { Image } from "expo-image";
import { useAuthStore } from '../../store/authStore';
import { useEffect, useState } from 'react';
import styles from "../../assets/styles/home.styles";
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../colectionColor/colors';
import { formatPublishDate } from '../../lib/utils';
import Loader from '../../component/Loader';
import { Link } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select'; 
import { apiFetch } from "../../store/apiClient";
import { useFilterStore } from "../../store/fileStore";
import { useRouter } from "expo-router";
import { carFormStyles } from "../../assets/styles/CarFormStyles";

export default function Properties() {
  const {accessToken} = useAuthStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [addMore, setAddMore] = useState(true);
  const [locationFilter, setLocationFilter] = useState("");
  const [adType, setAdType] = useState("all"); // 👈 نوع آگهی

 const {  property3 } = useFilterStore();
 const router = useRouter();

  const fetchProperties = async (pageNum = 1, refresh = false) => {
  try {
    if (refresh) setRefreshing(true);
    else if (pageNum === 1) setLoading(true);

  const query = new URLSearchParams({
  page: pageNum,
  limit: 5,
  adType: property3.propertyType || "",
  location: property3.location || "",
  price: property3.price || "",
  rentPrice: property3.rentPrice || "",
  mortgagePrice: property3.mortgagePrice || "",
  area: property3.area || ""
}).toString();


    const res = await apiFetch(`/properties?${query}`, {
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

  

  const renderItem = ({ item }) => (
    <Link
      href={{
        pathname: "/details/property-details",
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
      data={properties}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing}
          onRefresh={() => fetchProperties(1, true)}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      
   ListHeaderComponent={
  <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>

    {/* ردیف اول: نوع آگهی و ولایت */}
   <View style={carFormStyles.row}>
      {/* نوع آگهی */}
      <TouchableOpacity
       style={carFormStyles.touchable}
        onPress={() => router.push({ pathname: "/filter", params: { type: "propertyType1" } })}
      >
        <Text>{property3.propertyType || "نوع آگهی"}</Text>
      </TouchableOpacity>

      {/* ولایت */}
      <TouchableOpacity
       style={carFormStyles.touchable}
        onPress={() => router.push({ pathname: "/page/select-location", params: { section: "property1" } })}
      >
        <Text style={{ color: property3.location ? COLORS.black : COLORS.placeholderText, fontSize: 16 }}>
          {property3.location || "ولایت"}
        </Text>
      </TouchableOpacity>
    </View>

    {/* ردیف دوم: فیلدهای شرطی */}
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
      
      {/* اگر فروش انتخاب شده → قیمت فروش */}
      {property3.propertyType === "فروش" && (
        <TouchableOpacity
          style={carFormStyles.touchable}
          onPress={() => router.push({ pathname: "/filter", params: { type: "price1" } })}
        >
          <Text>{property3.price || "قیمت فروش"}</Text>
        </TouchableOpacity>
      )}

      {/* اگر کرایه انتخاب شده → کرایه */}
      {property3.propertyType === "کرایه" && (
        <TouchableOpacity
          style={carFormStyles.touchable}
          onPress={() => router.push({ pathname: "/filter", params: { type: "rentPrice1" } })}
        >
          <Text>{property3.rentPrice || "کرایه"}</Text>
        </TouchableOpacity>
      )}

      {/* اگر گرو انتخاب شده → گرو */}
      {property3.propertyType === "گرو" && (
        <TouchableOpacity
         style={carFormStyles.touchable}
          onPress={() => router.push({ pathname: "/filter", params: { type: "mortgagePrice1" } })}
        >
          <Text>{property3.mortgagePrice || "گرو"}</Text>
        </TouchableOpacity>
      )}

      {/* اگر گرو و کرایه انتخاب شده → هر دو */}
      {property3.propertyType === "گرو و کرایه" && (
        <>
          <TouchableOpacity
             style={carFormStyles.touchable}
            onPress={() => router.push({ pathname: "/filter", params: { type: "rentPrice1" } })}
          >
            <Text>{property3.rentPrice || "کرایه"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
           style={carFormStyles.touchable}
            onPress={() => router.push({ pathname: "/filter", params: { type: "mortgagePrice1" } })}
          >
            <Text>{property3.mortgagePrice || "گرو"}</Text>
          </TouchableOpacity>
        </>
      )}

      {/* متراژ همیشه نمایش داده بشه */}
      <TouchableOpacity
        style={carFormStyles.touchable}
        onPress={() => router.push({ pathname: "/filter", params: { type: "area1" } })}
      >
        <Text>{property3.area || "متراژ"}</Text>
      </TouchableOpacity>
    </View>

    {/* دکمه جستجو */}
    {(property3.propertyType || property3.location || property3.price || property3.rentPrice || property3.mortgagePrice || property3.area) && (
      <TouchableOpacity style={styles.button} onPress={() => fetchProperties(1, true)}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="search" size={22} color={COLORS.black} />
          <Text style={styles.buttonText}>جستجو کنید</Text>
        </View>
      </TouchableOpacity>
    )}
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
);
 }

