import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getUserProfile } from "../utils/api";
import { useToast } from "../hooks/useToast";
import ToastContainer from "./ToastContainer";
import "../Styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile");
        // If unauthorized, redirect to login
        if (error.message.includes("not authenticated") || error.message.includes("401")) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleEditBio = () => {
    navigate("/edit-bio");
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <div className="loading-spinner">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p>No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="profile-layout">
        {/* Left Rail */}
        <div className="profile-rail">
          <div className="avatar-container">
            <img
              src={profile.photoURL || "https://i.pravatar.cc/150?img=32"}
              alt="User Avatar"
              className="avatar"
            />
          </div>
          <h2 className="username">{profile.username || profile.displayName || "User"}</h2>
          <div className="rail-accent"></div>
        </div>

        {/* Right Content */}
        <div className="profile-content">
          {/* Basic Info Section */}
          <div className="profile-section">
            <h3>Profile Information</h3>
            <div className="profile-section info">
              <div>
                <span className="label">Display Name</span>
                <p className="value">{profile.displayName || "Not set"}</p>
              </div>
              <div>
                <span className="label">Email</span>
                <p className="value">{profile.email || "Not set"}</p>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          {profile.personalDetails && (
            <div className="profile-section">
              <h3>Personal Details</h3>
              <div className="profile-section info">
                <div>
                  <span className="label">Full Name</span>
                  <p className="value">{profile.personalDetails.fullName || "Not set"}</p>
                </div>
                <div>
                  <span className="label">Gender</span>
                  <p className="value">
                    {profile.personalDetails.gender
                      ? profile.personalDetails.gender.charAt(0).toUpperCase() +
                        profile.personalDetails.gender.slice(1)
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <span className="label">Nationality</span>
                  <p className="value">{profile.personalDetails.nationality || "Not set"}</p>
                </div>
                <div>
                  <span className="label">Category</span>
                  <p className="value">
                    {profile.personalDetails.category
                      ? profile.personalDetails.category.toUpperCase()
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <span className="label">Blood Group</span>
                  <p className="value">{profile.personalDetails.bloodGroup || "Not set"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Education Details */}
          {profile.educationDetails && (
            <div className="profile-section">
              <h3>Education</h3>
              <div className="profile-section info">
                <div>
                  <span className="label">School</span>
                  <p className="value">{profile.educationDetails.schoolName || "Not set"}</p>
                </div>
                <div>
                  <span className="label">Board</span>
                  <p className="value">{profile.educationDetails.board || "Not set"}</p>
                </div>
                <div>
                  <span className="label">Passing Year</span>
                  <p className="value">{profile.educationDetails.passingYear || "Not set"}</p>
                </div>
                <div>
                  <span className="label">Percentage</span>
                  <p className="value">
                    {profile.educationDetails.percentage
                      ? `${profile.educationDetails.percentage}%`
                      : "Not set"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="profile-actions">
            <button className="btn primary" onClick={handleEditBio}>
              Edit Bio
            </button>
            <button className="btn danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
