import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "../store/apiClient";
import jwtDecode from "jwt-decode";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);

    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    return true;
  }
};


export const useAuthStore = create((set) => ({

  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  isChecking: false,

  // -----------------------------
  //  ذخیره توکن‌ها (اصلاح‌شده)
  // -----------------------------
  setTokens: async (accessToken, refreshToken) => {
    await AsyncStorage.setItem("accessToken", accessToken);

    if (refreshToken) {
      await AsyncStorage.setItem("refreshToken", refreshToken);
    }

    set((state) => ({
      accessToken,
      refreshToken: refreshToken ?? state.refreshToken, // مهم
    }));
  },

  // -----------------------------
  //  ثبت‌نام
  // -----------------------------
  register: async (username, email, password) => {
    set({ isLoading: true });

    try {
      const response = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const rawText = await response.text();

let data;
try {
  data = JSON.parse(rawText);
} catch {
  data = { message: rawText };
}
      if (!response.ok) throw new Error(data.message || "Registration failed");


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

  // -----------------------------
  //  لاگین
  // -----------------------------
  login: async (email, password) => {
    set({ isLoading: true });

    try {

      const response = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
        const rawText = await response.text();

let data;

    // 🔥 اگر JSON بود → parse کن
    try {
      data = JSON.parse(rawText);
    } catch {
      // 🔥 اگر JSON نبود → یعنی rate-limit یا خطای متنی
      data = { message: rawText };
    }

//  const data = rawText ? JSON.parse(rawText) : {};

  //    const data = await response.json();



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

  // -----------------------------
  //  چک کردن وضعیت لاگین
  // -----------------------------
  checkAuth: async () => {
    set({ isChecking: true });

    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      // اگر accessToken منقضی شده بود → تلاش برای رفرش
      if (isTokenExpired(accessToken) && refreshToken) {

        const response = await apiFetch("/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });


      

        if (response.ok) {
        const data = await response.json();

          const { setTokens } = useAuthStore.getState();
          await setTokens(data.accessToken, refreshToken);

          set({ user });

        } else {
          await AsyncStorage.multiRemove(["user", "accessToken", "refreshToken"]);
          set({ accessToken: null, refreshToken: null, user: null });
        }

      } else {
        // اگر accessToken معتبر بود
        set({ accessToken, refreshToken, user });
      }

    } catch (error) {
      console.log("auth check failed", error);

    } finally {
      set({ isChecking: false });
    }
  },

  // -----------------------------
  //  خروج
  // -----------------------------
  logout: async () => {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
    set({ accessToken: null, refreshToken: null, user: null });
  },

}));

