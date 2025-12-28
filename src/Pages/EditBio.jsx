import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";
import { submitBio, getUserProfile } from "../utils/api";
import "../Styles/EditBio.css";

const EditBio = () => {
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    nationality: "",
    category: "",
    bloodGroup: "",
    education: {
      schoolName: "",
      board: "",
      passingYear: "",
      percentage: "",
    },
    emergencyContact: {
      name: "",
      relation: "",
      phone: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile.personalDetails) {
          setFormData((prev) => ({
            ...prev,
            fullName: profile.personalDetails.fullName || "",
            gender: profile.personalDetails.gender || "",
            nationality: profile.personalDetails.nationality || "",
            category: profile.personalDetails.category || "",
            bloodGroup: profile.personalDetails.bloodGroup || "",
            education: profile.educationDetails || prev.education,
            emergencyContact: profile.emergencyContact || prev.emergencyContact,
            address: profile.address || prev.address,
          }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        // Don't show error, just use empty form
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await submitBio({
        personalDetails: {
          fullName: formData.fullName,
          gender: formData.gender,
          nationality: formData.nationality,
          category: formData.category,
          bloodGroup: formData.bloodGroup,
        },
        educationDetails: formData.education,
        emergencyContact: formData.emergencyContact,
        address: formData.address,
      });

      toast.success("Bio updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("Bio update error:", error);
      toast.error(error.message || "Failed to update bio");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="edit-bio-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="edit-bio-page">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="edit-bio-container">
        <div className="bio-header">
          <h1>Edit Bio</h1>
          <p>Update your college application details</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-bio-form">
          {/* Personal Details Section */}
          <div className="form-section">
            <h3>Personal Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nationality">Nationality</label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder="Enter your nationality"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                  <option value="ews">EWS</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {/* Education Details Section */}
          <div className="form-section">
            <h3>Education Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="schoolName">School Name</label>
                <input
                  type="text"
                  id="schoolName"
                  value={formData.education.schoolName}
                  onChange={(e) =>
                    handleNestedChange("education", "schoolName", e.target.value)
                  }
                  placeholder="Enter school name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="board">Board</label>
                <input
                  type="text"
                  id="board"
                  value={formData.education.board}
                  onChange={(e) =>
                    handleNestedChange("education", "board", e.target.value)
                  }
                  placeholder="e.g., CBSE, ICSE"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="passingYear">Passing Year</label>
                <input
                  type="text"
                  id="passingYear"
                  value={formData.education.passingYear}
                  onChange={(e) =>
                    handleNestedChange("education", "passingYear", e.target.value)
                  }
                  placeholder="e.g., 2023"
                />
              </div>

              <div className="form-group">
                <label htmlFor="percentage">Percentage</label>
                <input
                  type="number"
                  id="percentage"
                  value={formData.education.percentage}
                  onChange={(e) =>
                    handleNestedChange("education", "percentage", e.target.value)
                  }
                  placeholder="Enter percentage"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="form-section">
            <h3>Emergency Contact</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emergencyName">Contact Name</label>
                <input
                  type="text"
                  id="emergencyName"
                  value={formData.emergencyContact.name}
                  onChange={(e) =>
                    handleNestedChange("emergencyContact", "name", e.target.value)
                  }
                  placeholder="Enter contact name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergencyRelation">Relation</label>
                <input
                  type="text"
                  id="emergencyRelation"
                  value={formData.emergencyContact.relation}
                  onChange={(e) =>
                    handleNestedChange("emergencyContact", "relation", e.target.value)
                  }
                  placeholder="e.g., Father, Mother, Friend"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="emergencyPhone">Contact Phone</label>
              <input
                type="tel"
                id="emergencyPhone"
                value={formData.emergencyContact.phone}
                onChange={(e) =>
                  handleNestedChange("emergencyContact", "phone", e.target.value)
                }
                placeholder="Enter contact phone number"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="form-section">
            <h3>Address Details</h3>
            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <textarea
                id="street"
                value={formData.address.street}
                onChange={(e) =>
                  handleNestedChange("address", "street", e.target.value)
                }
                placeholder="Enter street address"
                rows="2"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  value={formData.address.city}
                  onChange={(e) =>
                    handleNestedChange("address", "city", e.target.value)
                  }
                  placeholder="Enter city"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  value={formData.address.state}
                  onChange={(e) =>
                    handleNestedChange("address", "state", e.target.value)
                  }
                  placeholder="Enter state"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  id="pincode"
                  value={formData.address.pincode}
                  onChange={(e) =>
                    handleNestedChange("address", "pincode", e.target.value)
                  }
                  placeholder="Enter pincode"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  value={formData.address.country || "India"}
                  onChange={(e) =>
                    handleNestedChange("address", "country", e.target.value)
                  }
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBio;

