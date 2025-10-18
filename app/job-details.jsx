
import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import styles from '../assets/styles/jobDetails.styles'; 
import { formatPublishDate } from '../lib/utils';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../colectionColor/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JobDetails() {
  const { data } = useLocalSearchParams();
  const parsedJob = typeof data === 'string' ? JSON.parse(data) : data;

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
      {/* هدر */}
      <View style={styles.header}>
        <Image source={{ uri: parsedJob.user?.profileImage }} style={styles.avatar} />
        <Text style={styles.username}>{parsedJob.user?.username}</Text>
      </View>

      {/* تصویر اصلی */}
      <Image source={parsedJob.image} style={styles.jobImage} contentFit="cover" />

      <View style={styles.details}>
        {/* عنوان */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Text style={styles.title}>{parsedJob.title}</Text>
        </View>

        {/* شماره تماس */}
        {parsedJob.phoneNumber && (
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}
            onPress={() => handleCall(parsedJob.phoneNumber)}
          >
            <Ionicons name="call-outline" size={20} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.info, { color: 'blue' }]}>
              تماس با : {parsedJob.phoneNumber}
            </Text>
          </TouchableOpacity>
        )}

        {/* محل کار */}
        {parsedJob.jobtitle && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Ionicons name="business-outline" size={20} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.info}>محل کار : {parsedJob.jobtitle}</Text>
          </View>
        )}

        {/* درآمد */}
        {parsedJob.income && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Ionicons name="cash-outline" size={20} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.info}>معاش: {parsedJob.income}</Text>
          </View>
        )}

        {/* توضیحات */}
        {parsedJob.caption && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            
            <Text style={styles.caption}>{parsedJob.caption}</Text>
          </View>
        )}

        {/* تاریخ */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Text style={styles.date}>
            اضافه شده در تاریخ {formatPublishDate(parsedJob.createdAt)}
          </Text>
        </View>
      </View>
      <SafeAreaView edges={["bottom"]} style={{paddingBottom: 80}}/>
    </ScrollView>
  );
}

