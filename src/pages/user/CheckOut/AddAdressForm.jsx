import React, { useState } from "react";
import addressService from "../../../services/addressService";
import { useNavigate } from "react-router-dom";
import "./AddAddressForm.css"; // Optional, create for custom styles

const AddAddressForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    alternatePhone: "",
    pincode: "",
    houseNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    addressType: "Home",
    isDefault: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (
      !form.fullName ||
      !form.phoneNumber ||
      !form.pincode ||
      !form.city ||
      !form.state
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await addressService.createAddress(form);
      alert("Address added successfully.");
      navigate("/checkout"); // Or redirect to address list
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to add address.");
    }
  };

  return (
    <div className="add-address-form">
      <h2>Add New Address</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          name="alternatePhone"
          placeholder="Alternate Phone"
          value={form.alternatePhone}
          onChange={handleChange}
        />
        <input
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          required
        />
        <input
          name="houseNumber"
          placeholder="House Number"
          value={form.houseNumber}
          onChange={handleChange}
        />
        <input
          name="street"
          placeholder="Street"
          value={form.street}
          onChange={handleChange}
        />
        <input
          name="landmark"
          placeholder="Landmark"
          value={form.landmark}
          onChange={handleChange}
        />
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />
        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          required
        />
        <input
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
        />

        <select
          name="addressType"
          value={form.addressType}
          onChange={handleChange}
        >
          <option value="Home">Home</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
          />
          Set as Default Address
        </label>

        <button type="submit">Save Address</button>
        <button type="button" onClick={() => navigate("/checkout")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddAddressForm;
