import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

const tokenKey = "ml_token";
export const getToken = () => localStorage.getItem(tokenKey);
export const setToken = (t: string) => localStorage.setItem(tokenKey, t);

API.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) {
    cfg.headers = cfg.headers || {};
    (cfg.headers as any).Authorization = `Bearer ${t}`;
  }
  return cfg;
});

export async function ensureAnonSession() {
  if (!getToken()) {
    const deviceId =
      localStorage.getItem("ml_device") ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 15));

    localStorage.setItem("ml_device", deviceId);
    const res: any = await API.post("/auth/anon", { deviceId });
    setToken(res.data.token);
  }
}

export default API;
