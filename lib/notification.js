import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { API_URL } from '../constants/api';

export async function registerForPushNotificationsAsync(userToken) {
  if (Device.isDevice) {
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

    const token = (await Notifications.getExpoPushTokenAsync()).data;

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

