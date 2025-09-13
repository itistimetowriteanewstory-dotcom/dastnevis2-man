
import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import styles from '../assets/styles/bookDetails.styles'; 
import { formatPublishDate } from '../../mobile/lib/utils';

export default function BookDetails() {
  const { book } = useLocalSearchParams();
  const parsedBook = typeof book === 'string' ? JSON.parse(book) : book;

  const handleCall = (phoneNumber) => {
    if (!phoneNumber) return;

    const url = Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('خطا', 'امکان باز کردن شماره‌گیر وجود ندارد');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('خطا در باز کردن شماره‌گیر:', err));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: parsedBook.user.profileImage }} style={styles.avatar} />
        <Text style={styles.username}>{parsedBook.user.username}</Text>
      </View>

      <Image source={parsedBook.image} style={styles.bookImage} contentFit="cover" />

      <View style={styles.details}>
        <Text style={styles.title}>{parsedBook.title}</Text>

        {parsedBook.phoneNumber && (
          <TouchableOpacity onPress={() => handleCall(parsedBook.phoneNumber)}>
            <Text style={[styles.info, { color: 'blue' }]}>
               تماس با : {parsedBook.phoneNumber}
            </Text>
          </TouchableOpacity>
        )}

        {parsedBook.jobtitle && (
          <Text style={styles.info}>حوزه شغلی: {parsedBook.jobtitle}</Text>
        )}

        {parsedBook.income && (
          <Text style={styles.info}>معاش: {parsedBook.income}</Text>
        )}

        <Text style={styles.caption}>{parsedBook.caption}</Text>
        <Text style={styles.date}>اضافه شده در تاریخ {formatPublishDate(parsedBook.createdAt)}</Text>
      </View>
    </ScrollView>
  );
}

