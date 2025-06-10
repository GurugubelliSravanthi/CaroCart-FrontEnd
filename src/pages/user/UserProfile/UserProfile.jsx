import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("carocart_token");
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dob: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get("http://localhost:8081/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
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
        responseType: "blob",
      });

      const imageBlob = new Blob([response.data]);
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImageUrl(imageObjectURL);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Image load error:", err);
      }
    } finally {
      setImageLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage("❌ File size must be less than 2MB");
      return;
    }

    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      setMessage("❌ Only JPEG, PNG, and GIF images are allowed");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      await axios.post("http://localhost:8081/users/profile/upload-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await loadProfileImage();
      setMessage("✅ Profile picture updated");
      setShowEditPopup(false); // Close popup after upload
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed");
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  // Add this missing handleChange function to update any input dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8081/users/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Profile updated");
    } catch (err) {
      setMessage("❌ Update failed");
    }
  };

  if (loading) return <div className="loading-text">Loading profile...</div>;

  return (
    <div className="user-profile-container">
      <h2 className="user-profile-title">User Profile</h2>

      {message && (
        <p className={`user-profile-message ${message.startsWith("✅") ? "success" : "error"}`}>
          {message}
        </p>
      )}

      <div className="profile-image-wrapper">
        <div className="profile-image-box" onClick={() => setShowEditPopup(!showEditPopup)}>
          {imageUrl ? (
            <img src={imageUrl} alt="Profile" />
          ) : (
            <div className="no-image">No Image</div>
          )}
          <div className="camera-icon">
            <FaCamera />
          </div>
        </div>

        {showEditPopup && (
          <div className="edit-popup">
            <button onClick={openFileDialog}>Edit Photo</button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/jpg,image/png,image/gif"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
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
          <label>phoneNumber:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={user.phoneNumber || ""}
            onChange={handleChange}
            placeholder="Enter phoneNumber "
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={user.dob || ""}
            onChange={handleChange}
            placeholder="Select DOB"
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
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
