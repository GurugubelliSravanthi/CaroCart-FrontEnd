import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("carocart_token");
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Load user profile data
    axios.get("http://localhost:8081/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setUser(res.data);
      setLoading(false);
      // Load profile image after user data is loaded
      loadProfileImage();
    })
    .catch((err) => {
      console.error("Profile load error:", err);
      localStorage.removeItem("carocart_token");
      navigate("/login");
    });
  }, [token, navigate]);

  const loadProfileImage = async () => {
    try {
      setImageLoading(true);
      const response = await axios.get("http://localhost:8081/users/profile/image", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create a blob URL for the image
      const imageBlob = new Blob([response.data]);
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImageUrl(imageObjectURL);
    } catch (err) {
      console.log("No profile image found or error loading image:", err.response?.status);
      // Don't show error for 404 (no image found) - this is normal
      if (err.response?.status !== 404) {
        console.error("Image load error:", err);
      }
    } finally {
      setImageLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setMessage("❌ File size must be less than 2MB");
        return;
      }
      
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        setMessage("❌ Only JPEG, PNG, and GIF images are allowed");
        return;
      }
      
      setProfileImage(file);
      setMessage(""); // Clear any previous messages
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Update user profile data first
      await axios.put("http://localhost:8081/users/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Upload profile image if selected
      if (profileImage) {
        const formData = new FormData();
        formData.append("profileImage", profileImage); // ✅ Fixed: Match backend parameter name

        await axios.post("http://localhost:8081/users/profile/upload-image", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        
        // Reload the profile image after successful upload
        await loadProfileImage();
        setProfileImage(null); // Clear the file input
        
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      }

      setMessage("✅ Profile updated successfully");
    } catch (err) {
      console.error("Error:", err);
      const errorMessage = err.response?.data || err.message || "Unknown error";
      setMessage("❌ Update failed: " + errorMessage);
    }
  };

  // Cleanup blob URL on component unmount
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  if (loading) return <div className="loading-text">Loading profile...</div>;

  return (
    <div className="user-profile-container">
      <h2 className="user-profile-title">User Profile</h2>
      {message && (
        <p className={`user-profile-message ${message.startsWith("✅") ? "success" : "error"}`}>
          {message}
        </p>
      )}

      <div className="profile-image-container">
        {imageLoading ? (
          <div className="image-placeholder">Loading image...</div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            width="120"
            height="120"
            style={{ borderRadius: "50%", objectFit: "cover" }}
            onError={() => {
              console.log("Image failed to load");
              setImageUrl("");
            }}
          />
        ) : (
          <div className="image-placeholder" style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            backgroundColor: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #ccc"
          }}>
            No Image
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="user-profile-form">
        <div className="form-group">
          <label>First Name:</label>
          <input 
            type="text" 
            name="firstName" 
            value={user.firstName || ""} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input 
            type="text" 
            name="lastName" 
            value={user.lastName || ""} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={user.email || ""} 
            readOnly 
            style={{ backgroundColor: "#f1f5f9" }} 
          />
        </div>
        <div className="form-group">
          <label>Upload Profile Image:</label>
          <input 
            type="file" 
            accept="image/jpeg,image/jpg,image/png,image/gif" 
            onChange={handleImageChange}
          />
          {profileImage && (
            <p style={{ fontSize: "0.9em", color: "#666", marginTop: "5px" }}>
              Selected: {profileImage.name} ({(profileImage.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;