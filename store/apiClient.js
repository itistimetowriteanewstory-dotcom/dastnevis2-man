import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../colectionColor/api";

// یک تابع کمکی برای درخواست‌ها
export async function apiFetch(endpoint, options = {}) {
  let accessToken = await AsyncStorage.getItem("accessToken");
  const refreshToken = await AsyncStorage.getItem("refreshToken");

  // اضافه کردن هدر Authorization
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  // اولین درخواست
  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // اگر Access Token منقضی شده بود
  if (response.status === 401 && refreshToken) {
    try {
      // درخواست رفرش
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        accessToken = data.accessToken;

        // ذخیره Access Token جدید
        await AsyncStorage.setItem("accessToken", accessToken);

        // درخواست اصلی رو دوباره بفرست
        response = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        // اگر Refresh Token هم منقضی شده بود → کاربر باید لاگین کنه
        throw new Error("Session expired, please login again");
      }
    } catch (err) {
      throw err;
    }
  }

  return response;
}

