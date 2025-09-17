import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../component/SafeScreen"
import { StatusBar } from "expo-status-bar";
import {useAuthStore} from "../store/authStore";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

export default function RootLayout() {

  const router = useRouter();
  const segments = useSegments();

   const {checkAuth, user, token} = useAuthStore()

   useEffect(()=> {
   checkAuth();
   },[])

   // handle navigation based on the auth state
   useEffect(()=>{
    if (!router || segments.length === 0) return;
    const isAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if(!isSignedIn && !isAuthScreen) router.replace("/(auth)");
   else if(isSignedIn && isAuthScreen) router.replace("/(tabs)");


   },[user, token, segments])

    // 📲 اضافه کردن Listenerهای نوتیفیکیشن
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

    // پاکسازی هنگام خروج
    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  return (  
    <SafeAreaProvider>
      <SafeScreen>
    <Stack screenOptions={{headerShown: false}}>
    <Stack.Screen name="(tabs)"  />
     <Stack.Screen name="(auth)"  />
    </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
   
  );
}
