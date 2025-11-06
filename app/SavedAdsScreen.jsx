import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../colectionColor/colors";
import { useAuthStore } from "../store/authStore";

import { useRouter } from "expo-router";
import { apiFetch } from "../store/apiClient";

export default function SavedAdsScreen() {
  const [savedAds, setSavedAds] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 📌 گرفتن لیست ذخیره‌ها
  const fetchSavedAds = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/saved-ads", {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      const text = await res.text();

      if (!res.ok) {
        Alert.alert("خطا", "پاسخ سرور معتبر نیست");
        return;
      }

      const data = JSON.parse(text);
      setSavedAds(data.filter(item => item.ad !== null));
    } catch (error) {
      console.error("Error fetching saved ads:", error);
      Alert.alert("خطا", "مشکلی در دریافت لیست ذخیره‌ها پیش آمد");
    } finally {
      setLoading(false);
    }
  };

  // 📌 حذف یک ذخیره
  const removeSavedAd = async (adId) => {
    try {
      const res = await apiFetch("/saved-ads", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ adId })
      });

      if (!res.ok) {
        const err = await res.json();
        Alert.alert("خطا", err.message || "مشکلی پیش آمد");
        return;
      }

      setSavedAds((prev) => prev.filter((item) => item.ad?._id !== adId));
      Alert.alert("موفق", "آگهی از ذخیره‌ها حذف شد");
    } catch (error) {
      console.error("Error removing saved ad:", error);
      Alert.alert("خطا", "مشکلی در حذف ذخیره پیش آمد");
    }
  };

  useEffect(() => {
    fetchSavedAds();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* هدر */}
      <Text style={styles.headerTitle}>آگهی‌های ذخیره شده</Text>

      <FlatList
        data={savedAds}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              if (!item.ad) {
                Alert.alert("خطا", "این آگهی دیگر موجود نیست");
                return;
              }
              router.push({
                pathname: item.adType === "job" ? "/job-details" : "/property-details",
                params: { data: JSON.stringify(item.ad) }
              });
            }}
          >
            <View style={styles.card}>
              <View style={{ flex: 1, marginRight: 10 }}>
                {/* عنوان آگهی */}
                <Text
                  style={styles.title}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.ad?.title || "بدون عنوان"}
                </Text>

                <Text style={styles.subtitle}>
                  {item.adType === "job"
                    ? `معاش: ${item.ad?.income || "-"}`
                    : item.ad
                      ? [
                          item.ad?.price ? `قیمت فروش: ${item.ad.price}` : null,
                          item.ad?.rentPrice ? `کرایه: ${item.ad.rentPrice}` : null,
                          item.ad?.mortgagePrice ? `گرو: ${item.ad.mortgagePrice}` : null,
                        ]
                          .filter(Boolean)
                          .join(" | ")
                      : "اطلاعات آگهی موجود نیست"}
                </Text>
              </View>

              <TouchableOpacity onPress={() => removeSavedAd(item.ad?._id)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
         ListEmptyComponent={
    <View style={styles.emptyContainer}>
      <Ionicons name="folder-open-outline" size={50} color={COLORS.primary} />
      <Text style={styles.emptyText}>
        آگهی‌های مورد پسند خود را ذخیره کنید تا در اینجا بتوانید آن‌ها را ببینید
      </Text>
    </View>
     }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9e6ba", // پس‌زمینه سفید
    padding: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: COLORS.primary,
    textAlign: "center"
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#faeccdff", // کمی تیره‌تر از سفید
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    // سایه برای iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // سایه برای اندروید
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textDark || "#333"
  },
  subtitle: {
    fontSize: 14,
    color: "gray"
  },
  emptyContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 150,
  paddingHorizontal: 20,
},

emptyText: {
  marginTop: 12,
  fontSize: 16,
  color: COLORS.textSecondary || "gray",
  textAlign: "center",
  lineHeight: 22,
},


});

