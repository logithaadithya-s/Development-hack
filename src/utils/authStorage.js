const STORAGE_KEY = "auth_state";

export const saveAuthState = (data) => {
  const authState = {
    uid: data.uid,
    profileCompleted: data.profileCompleted,
    isAuthenticated: true,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
};

export const loadAuthState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearAuthState = () => {
  localStorage.removeItem(STORAGE_KEY);
};
