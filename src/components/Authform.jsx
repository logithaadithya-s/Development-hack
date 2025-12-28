import "../Styles/Authform.css";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

import { auth, googleProvider } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { verifyGoogleAuth } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import ToastContainer from "./ToastContainer";

function Authform() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toasts, toast, removeToast } = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const toggleForm = () => setIsRegister((prev) => !prev);

  // ---------- SHARED BACKEND AUTH ----------
  const authenticateWithBackend = async (user) => {
    const idToken = await user.getIdToken(true);
    const backendResponse = await verifyGoogleAuth(idToken);

    // Save to Context (and localStorage internally)
    login(backendResponse);

    // Route based on profile completion
    if (!backendResponse.profileCompleted) {
      navigate("/profile-completion");
    } else {
      navigate("/profile");
    }
  };

  // ---------- EMAIL / PASSWORD ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isRegister) {
        if (!regEmail || !regPassword) {
          toast.error("Email and password required");
          return;
        }

        const res = await createUserWithEmailAndPassword(
          auth,
          regEmail,
          regPassword
        );

        await authenticateWithBackend(res.user);
      } else {
        if (!loginEmail || !loginPassword) {
          toast.error("Email and password required");
          return;
        }

        const res = await signInWithEmailAndPassword(
          auth,
          loginEmail,
          loginPassword
        );

        await authenticateWithBackend(res.user);
      }
    } catch (error) {
      console.error(error);

      switch (error.code) {
        case "auth/invalid-email":
          toast.error("Invalid email address");
          break;
        case "auth/user-not-found":
          toast.error("User not found");
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password");
          break;
        case "auth/email-already-in-use":
          toast.error("Email already registered");
          break;
        case "auth/weak-password":
          toast.error("Password must be at least 6 characters");
          break;
        default:
          toast.error(error.message || "Authentication failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- GOOGLE AUTH ----------
  const handleGoogleAuth = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!result.user) {
        throw new Error("Google sign-in failed");
      }

      await authenticateWithBackend(result.user);
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error(error.message || "Google authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className={`wrapper ${isRegister ? "active" : ""}`}>
        {/* LOGIN */}
        <div className="form-box login">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <label>Email</label>
            </div>

            <div className="input-box">
              <input
                type={showLoginPassword ? "text" : "password"}
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <label>Password</label>
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                {showLoginPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button className="btn" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <div className="google-auth">
              <div className="divider">
                <span>Or continue with</span>
              </div>
              <button
                type="button"
                className="btn-google"
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                <FcGoogle /> Sign in with Google
              </button>
            </div>

            <p className="logreg-link">
              Don&apos;t have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>
                Register
              </a>
            </p>
          </form>
        </div>

        {/* REGISTER */}
        <div className="form-box register">
          <h2>Register</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <label>Email</label>
            </div>

            <div className="input-box">
              <input
                type={showRegisterPassword ? "text" : "password"}
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <label>Password</label>
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
              >
                {showRegisterPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button className="btn" type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </button>

            <div className="google-auth">
              <div className="divider">
                <span>Or sign up with</span>
              </div>
              <button
                type="button"
                className="btn-google"
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                <FcGoogle /> Sign up with Google
              </button>
            </div>

            <p className="logreg-link">
              Already have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Authform;
