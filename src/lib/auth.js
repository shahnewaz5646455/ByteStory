// lib/auth.js
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("authToken"); // token saved after login
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT
    const now = Date.now() / 1000;
    return payload.exp > now; // check expiration
  } catch (err) {
    return false;
  }
};
