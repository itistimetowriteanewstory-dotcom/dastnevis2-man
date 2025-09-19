import { useEffect, useState } from "react";
import {
  View,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../component/ProfileHeader";
import LogoutButton from "../../component/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { Image } from "expo-image";
import Loader from "../../component/Loader";

export default function Profile() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const { token } = useAuthStore();

  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/books/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "امکان بارگذاری شغل های ثبت شده شما وجود ندارد");

      setBooks(data);
    } catch (error) {
      console.error("دریافت اطلاعات با خطا مواجه شد:", error);
      Alert.alert("خطا", "بارگذاری اطلاعات کاربر با خطا مواجه شد. برای تازه سازی صفحه را پایین بکشید");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteBook = async (bookId) => {
    try {
      setDeleteBookId(bookId);

      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "خطا در پاک کردن شغل");

      setBooks(books.filter((book) => book._id !== bookId));
      Alert.alert("موفقیت آمیز", "شغل حذف شد");
    } catch (error) {
      Alert.alert("خطا", error.message || "خطا در پاک کردن شغل");
    } finally {
      setDeleteBookId(null);
    }
  };

  const confirmDelete = (bookId) => {
    Alert.alert("حذف شغل؟", "آیا میخواهید شغل مورد نظر را پاک کنید؟", [
      { text: "لغو", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => handleDeleteBook(bookId) },
    ]);
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
       {item.income && (
  <Text style={styles.bookTitle}>معاش:افغانی {item.income}</Text>
)}
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        {deleteBookId === item._id ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    </View>
  );


  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(500);
    await fetchData();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) return <Loader />;

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      {/* دکمه رفتن به صفحه راهنما و قوانین */}
    <TouchableOpacity
      style={styles.helpButton}
      onPress={() => router.push("/help-and-rules")}
    >
      <Ionicons name="help-circle-outline" size={20} color={COLORS.white} />
      <Text style={styles.helpButtonText}>راهنما و قوانین</Text>
    </TouchableOpacity>


      {/* YOUR RECOMMENDATIONS */}
      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>کار های ثبت شده شما</Text>
        <Text style={styles.booksCount}>{books.length} شغل</Text>
      </View>

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={50} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>شغلی اضافه نشده</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Text style={styles.addButtonText}>اولین موقعیت شغلی خودرا ثبت کنید</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}