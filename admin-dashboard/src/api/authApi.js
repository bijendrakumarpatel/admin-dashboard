import api, { tokenStorage } from "./apiClient";

// Helper: Parse error message safely
const parseError = (err) => {
  if (err.response && err.response.data) {
    return { 
      message: err.response.data.message || "Validation Error", 
      status: err.response.status,
      details: err.response.data 
    };
  }
  return { message: err.message || "Unknown error" };
};

// ----------------------------------
// SMARTER PAYLOAD EXTRACTOR (FIXED)
// ----------------------------------
const getPayload = (res) => {
  const rawData = res.data;

  console.log("🔍 Raw Backend Response:", rawData);

  // 1. Standard: Token at top level (e.g., { token: '...' })
  if (rawData.accessToken || rawData.token) {
    return rawData;
  }

  // 2. Standard Nested: Token inside 'data' (e.g., { data: { token: '...' } })
  if (rawData.data && (rawData.data.accessToken || rawData.data.token)) {
    return rawData.data;
  }

  // 3. CRITICAL FIX: Check inside 'message' field
  // Your backend logs showed the token is hiding here: { message: { accessToken: '...' }, data: "Success" }
  if (rawData.message && (rawData.message.accessToken || rawData.message.token)) {
    console.log("💡 Found token inside 'message' field");
    return rawData.message;
  }

  // 4. Fallback: Return rawData so the UI can see the full object in logs
  return rawData;
};

// ----------------------------------
// LOGIN
// ----------------------------------
export const login = async (credentials) => {
  try {
    console.log("🚀 API sending login:", credentials);

    const res = await api.post("/auth/login", credentials);
    
    // Use the smarter extractor
    const payload = getPayload(res); 
    console.log("✅ API received payload:", payload);

    // Token save logic
    const token = payload?.accessToken || payload?.token;
    const refreshToken = payload?.refreshToken;

    if (token) {
      tokenStorage.setTokens({
        accessToken: token,
        refreshToken: refreshToken || "",
      });
    } else {
        console.warn("⚠️ Login API succeeded but NO TOKEN was found in payload:", payload);
    }

    return payload;
  } catch (err) {
    console.error("❌ API Login Error:", parseError(err));
    throw parseError(err);
  }
};

// ----------------------------------
// VERIFY OTP
// ----------------------------------
export const verifyOtp = async ({ identifier, otp }) => {
  try {
    const res = await api.post("/auth/verify-otp", { identifier, otp });
    const payload = getPayload(res);
    
    const token = payload?.accessToken || payload?.token;

    if (token) {
      tokenStorage.setTokens({
        accessToken: token,
        refreshToken: payload?.refreshToken || "",
      });
    }
    return payload;
  } catch (err) {
    throw parseError(err);
  }
};

// ----------------------------------
// CURRENT USER
// ----------------------------------
export const me = async () => {
  try {
    const res = await api.get("/auth/me");
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

// ----------------------------------
// REFRESH TOKENS
// ----------------------------------
export const refreshTokens = async () => {
  try {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw { message: "No refresh token" };

    const res = await api.post("/auth/refresh-token", { refreshToken });
    const payload = getPayload(res);

    const token = payload?.accessToken || payload?.token;

    if (token) {
      tokenStorage.setTokens({
        accessToken: token,
        refreshToken: payload?.refreshToken || "",
      });
    }
    return payload;
  } catch (err) {
    throw parseError(err);
  }
};

// ----------------------------------
// LOGOUT
// ----------------------------------
export const logout = async () => {
  try {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      await api.post("/auth/logout", { refreshToken });
    }
  } catch (err) {
    console.warn("Logout error:", parseError(err));
  } finally {
    tokenStorage.clear();
  }
};

export default {
  login,
  verifyOtp,
  me,
  refreshTokens,
  logout,
};