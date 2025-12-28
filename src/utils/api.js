import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

/* --------------------------------------------------
   SAFE TOKEN FETCHER (no race conditions)
-------------------------------------------------- */
const getFreshIdToken = () =>
  new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();

      if (!user) {
        reject(new Error("User not authenticated"));
      } else {
        const token = await user.getIdToken(true); // force refresh
        resolve(token);
      }
    });
  });

/* --------------------------------------------------
   VERIFY FIREBASE AUTH (login / register / google)
-------------------------------------------------- */
export const verifyGoogleAuth = async () => {
  const idToken = await getFreshIdToken();

  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Authentication failed");
  }

  return res.json();
};

/* --------------------------------------------------
   SUBMIT BASIC PROFILE
-------------------------------------------------- */
export const submitBasicProfile = async (profileData) => {
  const idToken = await getFreshIdToken();

  const res = await fetch(`${API_BASE_URL}/user/profile/basic`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to submit profile");
  }

  return res.json();
};

/* --------------------------------------------------
   GET USER PROFILE
-------------------------------------------------- */
export const getUserProfile = async () => {
  const idToken = await getFreshIdToken();

  const res = await fetch(`${API_BASE_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch profile");
  }

  return res.json();
};

/* --------------------------------------------------
   SUBMIT BIO
-------------------------------------------------- */
export const submitBio = async (bioData) => {
  const idToken = await getFreshIdToken();

  const res = await fetch(`${API_BASE_URL}/user/profile/bio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(bioData),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to submit bio");
  }

  return res.json();
};
