import { View, Text, TouchableOpacity, FlatList, Modal, ActivityIndicator, RefreshControl, TextInput } from 'react-native'
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


export default function Properties() {
  const {accessToken} = useAuthStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [addMore, setAddMore] = useState(true);
  const [showPropertyFilters, setShowPropertyFilters] = useState(false);

  const [adType, setAdType] = useState("all"); // 👈 نوع آگهی
  const [showPropertySearchButton, setShowPropertySearchButton] = useState(false);

 const {  property3 } = useFilterStore();
 const router = useRouter();

 const propertyTypeOptions = [
  { label: "فروش", value: "sale" },
  { label: "کرایه", value: "rent" },
  { label: "گرو", value: "mortgage" },
  { label: "گرو و کرایه", value: "rent_mortgage" },
];

const propertyTypeLabels = propertyTypeOptions.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});



  const fetchProperties = async (pageNum = 1, refresh = false) => {
  try {
    if (refresh) setRefreshing(true);
    else if (pageNum === 1) setLoading(true);

  const query = new URLSearchParams({
  page: pageNum,
  limit: 5,
  type: property3.propertyType || "",
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

  useEffect(() => {
  if (
    property3.propertyType ||
    property3.location ||
    property3.price ||
    property3.rentPrice ||
    property3.mortgagePrice ||
    property3.area
  ) {
    setShowPropertySearchButton(true);
  } else {
    setShowPropertySearchButton(false);
  }
}, [
  property3.propertyType,
  property3.location,
  property3.price,
  property3.rentPrice,
  property3.mortgagePrice,
  property3.area
]);


let payload = {};

if (property3.propertyType === "sale") {
  payload.price = property3.price;
} else if (property3.propertyType === "rent") {
  payload.rentPrice = property3.rentPrice;
} else if (property3.propertyType === "mortgage") {
  payload.mortgagePrice = property3.mortgagePrice;
} else if (property3.propertyType === "rent_mortgage") {
  payload.rentPrice = property3.rentPrice;
  payload.mortgagePrice = property3.mortgagePrice;
}


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
      visible={showPropertyFilters}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowPropertyFilters(false)}
    >
      <View style={{ flex: 1, justifyContent: "flex-start", backgroundColor: "rgba(0,0,0,0.3)" }}>
        <View
          style={{
            height: "100%", // نصف صفحه
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
            marginTop: 70,
          }}
        >
          {/* دکمه بستن */}
          <TouchableOpacity onPress={() => setShowPropertyFilters(false)} style={{ alignSelf: "flex-start", marginBottom: 15, }}>
             <Ionicons name="close" size={35} color={COLORS.black} />
          </TouchableOpacity>

        <View style={{ marginBottom: 10, flexDirection: "row", flexWrap: "wrap", gap: 8,}}>
          <TouchableOpacity
             style={carFormStyles.touchable}
            onPress={() =>
              router.push({ pathname: "/filter", params: { type: "propertyType1" } })
            }
          >
            <Text
          style={{ color: property3.propertyType ? COLORS.black : COLORS.placeholderText, fontSize: 17 }}
            >
            {propertyTypeLabels[property3.propertyType] || "نوع آگهی"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ردیف دوم: ولایت + متراژ + فیلدهای شرطی */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          
          {/* ولایت */}
          <TouchableOpacity
            style={carFormStyles.touchable}
            onPress={() =>
              router.push({ pathname: "/page/select-location", params: { section: "property1" } })
            }
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: property3.location ? COLORS.black : COLORS.placeholderText,
                fontSize: 17,
              }}
            >
              {property3.location || "ولایت"}
            </Text>
          </TouchableOpacity>

          {/* متراژ */}
          <TouchableOpacity
            style={carFormStyles.touchable}
            onPress={() =>
              router.push({ pathname: "/filter", params: { type: "area1" } })
            }
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: property3.area ? COLORS.black : COLORS.placeholderText,
                fontSize: 16,
              }}
            >
              {property3.area || "متراژ"}
            </Text>
          </TouchableOpacity>

          {/* شرطی‌ها */}
          {property3.propertyType === "sale" && (
            <TouchableOpacity
              style={carFormStyles.touchable}
              onPress={() =>
                router.push({ pathname: "/filter", params: { type: "price1" } })
              }
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: property3.price ? COLORS.black : COLORS.placeholderText,
                  fontSize: 16,
                }}
              >
                {property3.price || "قیمت فروش"}
              </Text>
            </TouchableOpacity>
          )}

          {property3.propertyType === "rent" && (
            <TouchableOpacity
              style={carFormStyles.touchable}
              onPress={() =>
                router.push({ pathname: "/filter", params: { type: "rentPrice1" } })
              }
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: property3.rentPrice ? COLORS.black : COLORS.placeholderText,
                  fontSize: 16,
                }}
              >
                {property3.rentPrice || "کرایه"}
              </Text>
            </TouchableOpacity>
          )}

          {property3.propertyType === "mortgage" && (
            <TouchableOpacity
              style={carFormStyles.touchable}
              onPress={() =>
                router.push({ pathname: "/filter", params: { type: "mortgagePrice1" } })
              }
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: property3.mortgagePrice ? COLORS.black : COLORS.placeholderText,
                  fontSize: 16,
                }}
              >
                {property3.mortgagePrice || "گرو"}
              </Text>
            </TouchableOpacity>
          )}

          {property3.propertyType === "rent_mortgage" && (
            <>
              <TouchableOpacity
                style={carFormStyles.touchable}
                onPress={() =>
                  router.push({ pathname: "/filter", params: { type: "rentPrice1" } })
                }
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: property3.rentPrice ? COLORS.black : COLORS.placeholderText,
                    fontSize: 16,
                  }}
                >
                  {property3.rentPrice || "کرایه"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={carFormStyles.touchable}
                onPress={() =>
                  router.push({ pathname: "/filter", params: { type: "mortgagePrice1" } })
                }
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: property3.mortgagePrice ? COLORS.black : COLORS.placeholderText,
                    fontSize: 16,
                  }}
                >
                  {property3.mortgagePrice || "گرو"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

      
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              fetchProperties(1, true);
              setShowPropertySearchButton(false);
              setShowPropertyFilters(false)
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
      stickyHeaderIndices={[0]}
  ListHeaderComponent={
  <>
    {/* دکمه باز/بستن فیلترها */}
    <TouchableOpacity
      style={styles.filterToggleButton}
      onPress={() => setShowPropertyFilters(!showPropertyFilters)}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Ionicons name="filter" size={22} color={COLORS.black} />
        <Text style={styles.buttonText1}>
          {showPropertyFilters ? "بستن فیلترها" : "نمایش فیلترها"}
        </Text>
      </View>
    </TouchableOpacity>
  </>
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

