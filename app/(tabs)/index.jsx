import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, TextInput } from 'react-native'
import { Image } from "expo-image";
import { useAuthStore } from '../../store/authStore';
import { useEffect, useState } from 'react';
import styles from "../../assets/styles/home.styles";
import { API_URL } from '../../constants/api';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { formatPublishDate } from '../../lib/utils';
import Loader from '../../component/Loader';
import { Link } from 'expo-router';

export default function Home() {
  const {token} = useAuthStore();
   const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
const [locationFilter, setLocationFilter] = useState("");



  const fetchBooks = async (pageNum=1, refresh=false) => {

try {
  if(refresh) setRefreshing(true);
  else if(pageNum===1) setLoading(true);

const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=5`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const data = await response.json();
if(!response.ok) throw new Error(data.message || "failed to fetch books ");


// todo fix it later
//setBooks((prevBooks)=> [...prevBooks, ...data.books]);

const uniqueBooks =
  refresh || pageNum === 1
    ? data.books
    : Array.from(
        new Set([...books, ...data.books].map((book) => book._id))
      ).map((id) =>
        [...books, ...data.books].find((book) => book._id === id)
      );

setBooks(uniqueBooks);



setHasMore(pageNum < data.totalPages);
setPage(pageNum)

} catch (error) {
 // console.log("error fetching books ", error);
}finally{
  if(refresh) setRefreshing(false);
  else setLoading(false);
}

  };

  useEffect(() =>{
    fetchBooks()
  },[]);

  const handleLoadMore = async () => {
   if(hasMore && !loading && !refreshing) {
    await fetchBooks(page + 1);
   }
  };

const filteredBooks = books.filter(book => {
  const matchesTitle = book.title.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesLocation = locationFilter
    ? (book.location && book.location.toLowerCase().includes(locationFilter.toLowerCase()))
    : true;
  return matchesTitle && matchesLocation;
});

  const renderItem = ({item}) =>(

<Link
    href={{
      pathname: '/book-details',
      params: { book: JSON.stringify(item) },
    }}
    asChild
  >

    <TouchableOpacity activeOpacity={0.5}>
 <View style={styles.bookCard}>
  <View style={styles.header}> 
      <View style={styles.userInfo}>
        <Image
          source={{ uri: item.user.profileImage }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{item.user.username}</Text>
      </View>
   </View>

<View style={styles.bookImageContainer}>
  <Image source={item.image} style={styles.bookImage} contentFit="cover" />

</View>

<View style={styles.bookDetails}>
  <Text style={styles.bookTitle}>{item.title}</Text>

{item.phoneNumber && (
  <Text style={styles.bookTitle}> نمبر تلفون: {item.phoneNumber}</Text>
)}
  
  {item.location && (
  <Text style={styles.bookTitle}> ولایت: {item.location}</Text>
)}

  
  {item.income && (
    <Text style={styles.bookTitle}>معاش: افغانی{item.income}</Text>
  )}
 <Text style={styles.caption}
   numberOfLines={2}
  ellipsizeMode="tail"
 >{item.caption}</Text>
  <Text style={styles.date}> ثبت شده در تاریخ {formatPublishDate(item.createdAt)}</Text>

</View>

 </View>
 </TouchableOpacity>
 </Link>
  );


  if (loading) return <Loader />;



  return (
    <View style={styles.container}>
      <FlatList 
      data={searchQuery || locationFilter ? filteredBooks : books}
     // data={books}
       // data={filteredBooks}

      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    
refreshControl={
  <RefreshControl 
   refreshing={refreshing}
   onRefresh={()=> fetchBooks(1, true)}
   colors={[COLORS.primary]}
   tintColor={COLORS.primary}
  />
}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}

      
      ListHeaderComponent={
 <View>
    {/* بخش سرچ و فیلتر */}
    <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
      {/* جستجو بر اساس عنوان */}
      <TextInput
        style={{
          backgroundColor: COLORS.background,
          padding: 10,
          borderRadius: 8,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: COLORS.textSecondary
        }}
        placeholder="کار مورد نظر خود را بنویسید"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* فیلتر بر اساس شهر */}
      <TextInput
        style={{
          backgroundColor: COLORS.background,
          padding: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: COLORS.textSecondary
        }}
        placeholder="ولایت خود را بنویسید"
        value={locationFilter}
        onChangeText={setLocationFilter}
      />
    </View>
  </View>
      }
         
    


     

     //   <View style={styles.header}>
         // <Text style={styles.headerTitle}> سلام</Text>
         // <Text style={styles.headerSubtitle}> مامان بابا حالشون خوبع</Text>
       // </View>
      
ListFooterComponent ={
  hasMore && books.length > 0 ? (
    <ActivityIndicator
      style={styles.footerLoader}
      size="small"
      color={COLORS.primary}
    />
  ) : null
}


      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name='briefcase-outline' size={60} color={COLORS.textSecondary}/>
          <Text style={styles.emptyText}> هنوز کاری اضافه نشده</Text>
          <Text style={styles.emptySubtext}> اولین نفری باشید که یک موقعیت شغلی به برنامه اضافه میکنید </Text>
           </View>
      }
      />
     
    </View>
  )
}