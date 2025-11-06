import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from '../store/apiClient';
import jwtDecode from "jwt-decode";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    // exp بر حسب ثانیه است → ضربدر 1000 برای تبدیل به میلی‌ثانیه
    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    return true; // اگر توکن خراب بود یا decode نشد، منقضی در نظر بگیر
  }
};


export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
isChecking: false,

  register: async (username, email, password) => {
    set({ isLoading: true });

    try {
      const response = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      // ذخیره هر دو توکن
      await AsyncStorage.multiSet([
        ["user", JSON.stringify(data.user)],
        ["accessToken", data.accessToken],
        ["refreshToken", data.refreshToken],
      ]);

      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isLoading: false,
      });

      return { success: true, ...data };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      console.log("🔎 Fetching:","/auth/login");
      const response = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

       const rawText = await response.clone().text();
    console.log("🔎 Raw login response body:", rawText);

      



         console.log("🔎 Login response status:", response.status);
         console.log("🔎 Login response headers:", response.headers);


      const data = await response.json();
       console.log("🔎 Parsed login data:", data);

      if (!response.ok) throw new Error(data.message || "Login failed");

      await AsyncStorage.multiSet([
        ["user", JSON.stringify(data.user)],
        ["accessToken", data.accessToken],
        ["refreshToken", data.refreshToken],
      ]);

      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isLoading: false,
      });

      return { success: true, ...data };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  checkAuth: async () => {
     set({ isChecking: true });
    try {
     const accessToken = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const userJson = await AsyncStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    // بررسی انقضای accessToken
    if (isTokenExpired(accessToken)) {
      // تلاش برای گرفتن توکن جدید
      const response = await apiFetch("/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem("accessToken", data.accessToken);
        set({ accessToken: data.accessToken, refreshToken, user });
      } else {
        // اگر رفرش‌توکن هم نامعتبر بود → logout
        await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
        set({ accessToken: null, refreshToken: null, user: null });
      }
    } else {
      set({ accessToken, refreshToken, user });
    }
  } catch (error) {
    console.log("auth check failed", error);
    } finally {
      set({ isChecking: false });   // پایان چک کردن
     }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));

