import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../component/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "../store/apiClient";
import { ActivityIndicator, View } from "react-native";




export default function RootLayout() {

  const router = useRouter();
  const segments = useSegments();

  

  const { checkAuth, user, accessToken, refreshToken, logout, isChecking } = useAuthStore();

  // بارگذاری اولیه: چک کردن توکن‌ها
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();

       const storedAccess = await AsyncStorage.getItem("accessToken");
    const storedRefresh = await AsyncStorage.getItem("refreshToken");

          // حالت: هیچ توکنی ذخیره نشده → اولین ورود
    if (!storedAccess && !storedRefresh) {
      router.replace("/(auth)");
      return;
    }

      // اگر accessToken نداشتیم، تلاش برای گرفتن توکن جدید
      if (!accessToken && refreshToken) {
        try {
          const res = await apiFetch("/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (res.ok) {
            const data = await res.json();
            await AsyncStorage.setItem("accessToken", data.accessToken);
            useAuthStore.setState({ accessToken: data.accessToken });
          } else {
            // رفرش‌توکن هم نامعتبر بود → خروج و هدایت به لاگین
            await logout();
            router.replace("/(auth)/login");
          }
        } catch (err) {
          await logout();
          router.replace("/(auth)/login");
        }
      }
    };

    initAuth();
  }, []);
useEffect(() => {
   if (isChecking) return;
  if (!router || segments.length === 0) return;

  const inAuthGroup = segments[0] === "(auth)";
  const isSignedIn = user && accessToken;

  // اگر لاگین نیست و خارج از گروه (auth) هست → بفرست به لاگین
  if (!isSignedIn && !inAuthGroup) {
    router.replace("/(auth)/login");
  }

  // اگر لاگین هست و هنوز توی صفحات (auth) مونده → بفرست به تب‌ها
  if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    
   
  }
}, [user, accessToken, segments, isChecking]);


  // هدایت بر اساس وضعیت کاربر
  
  // 📲 Listenerهای نوتیفیکیشن
  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("نوتیف رسید:", notification);
      }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("کاربر روی نوتیف کلیک کرد:", response);
      }
    );


    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

   if (isChecking) {
    return (
     <SafeAreaProvider>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f9f9f9",
            }}
          >
            <ActivityIndicator size={50} color="#000000" />
          </View>
      </SafeAreaProvider>

    );
  }


  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
    
  );
}

