import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { API_URL } from '../colectionColor/api';

export async function registerForPushNotificationsAsync(userToken) {
  if (Device.isDevice) {
    // گرفتن پرمیشن
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('اجازه نوتیفیکیشن داده نشد');
      return;
    }

    // گرفتن Expo Push Token با senderId
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
        senderId: Constants.expoConfig.extra.firebase.senderId,
      })
    ).data;

    console.log("Expo Push Token:", token);

    // ذخیره توکن در سرور
    await fetch(`${API_URL}/auth/save-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ token }),
    });
  }
}


