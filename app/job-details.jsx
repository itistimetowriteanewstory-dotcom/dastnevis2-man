
import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import styles from '../assets/styles/jobDetails.styles'; 
import { formatPublishDate } from '../lib/utils';

export default function JobDetails() {
  const { job } = useLocalSearchParams();
  const parsedJob = typeof job === 'string' ? JSON.parse(job) : job;

  const handleCall = (phoneNumber) => {
    if (!phoneNumber) return;

    const url = Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;

    Linking.openURL(url)
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
        <Image source={{ uri: parsedJob.user?.profileImage }} style={styles.avatar} />
        <Text style={styles.username}>{parsedJob.user?.username}</Text>
      </View>

      <Image source={parsedJob.image} style={styles.jobImage} contentFit="cover" />

      <View style={styles.details}>
        <Text style={styles.title}>{parsedJob.title}</Text>

        {parsedJob.phoneNumber && (
          <TouchableOpacity onPress={() => handleCall(parsedJob.phoneNumber)}>
            <Text style={[styles.info, { color: 'blue' }]}>
               تماس با : {parsedJob.phoneNumber}
            </Text>
          </TouchableOpacity>
        )}

        {parsedJob.jobtitle && (
          <Text style={styles.info}>محل کار : {parsedJob.jobtitle}</Text>
        )}

        {parsedJob.income && (
          <Text style={styles.info}>معاش: {parsedJob.income}</Text>
        )}

        <Text style={styles.caption}>{parsedJob.caption}</Text>
        <Text style={styles.date}>اضافه شده در تاریخ {formatPublishDate(parsedJob.createdAt)}</Text>
      </View>
    </ScrollView>
  );
}

