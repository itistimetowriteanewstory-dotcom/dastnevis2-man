
import { API_URL } from "../colectionColor/api";
import { useAuthStore } from "./authStore";

let refreshPromise = null;




export async function apiFetch(endpoint, options = {}) {
  const { accessToken, refreshToken, setTokens } = useAuthStore.getState();

  // هدر اولیه (برای درخواست اول)
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

 
  // ارسال اولین درخواست
  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

 // console.log("RESPONSE:", endpoint, response.status);

  // اگر 401 بود → تلاش برای رفرش
  if (
    response.status === 401 &&
    refreshToken &&
    endpoint !== "/auth/refresh"
  ) {
    console.log("401 ERROR ON:", endpoint);

    try {
      // جلوگیری از چند رفرش همزمان
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          // اگر رفرش‌توکن منقضی شده → خروج
          if (refreshRes.status === 401) {
            const { logout } = useAuthStore.getState();
            await logout();
            throw new Error("Session expired");
          }

          // اگر خطای شبکه یا سرور → logout نکن
          if (!refreshRes.ok) {
            throw new Error("Network error during refresh");
          }

          const data = await refreshRes.json();
          console.log("REFRESH RESPONSE:", data);

          // ذخیره accessToken جدید + نگه داشتن refreshToken قدیمی
          await setTokens(data.accessToken, data.refreshToken);

          return data;
        })();
      }

      // منتظر رفرش
      const data = await refreshPromise;
      refreshPromise = null;

      // درخواست اصلی را دوباره با توکن جدید بزن
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

    } catch (err) {
      refreshPromise = null;
      throw err;
    }
  }

  return response;
}

