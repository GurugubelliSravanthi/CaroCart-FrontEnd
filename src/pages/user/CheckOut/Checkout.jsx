import React, { useState, useEffect } from "react";
import cartService from "../../../services/cartService";
import addressService from "../../../services/addressService";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
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
  const imageBaseURL = "http://localhost:8082/products/image/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await cartService.getCartItems();
        console.log("Fetched cart items:", items);
        if (items.length === 0) {
          alert("Cart is empty.");
          navigate("/");
          return;
        }
        setCartItems(items);

        const addresses = await addressService.getMyAddresses();
        console.log("Fetched addresses:", addresses);

        if (addresses && addresses.length > 0) {
          const def = addresses.find((a) => a.isDefault) || addresses[0];
          setDefaultAddress(def);
        } else {
          console.warn("No addresses found.");
          setUseDefaultAddress(false);
        }
      } catch (error) {
        console.error("❌ Error in fetchData:", error);
        alert("Error loading checkout. Please try again.");
      }
    };
    fetchData();
  }, [navigate]);
  

  const handleNewAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleContinue = async () => {
    try {
      if (!useDefaultAddress) {
        // Validate basic required fields
        if (
          !newAddress.fullName ||
          !newAddress.phoneNumber ||
          !newAddress.pincode ||
          !newAddress.houseNumber ||
          !newAddress.city ||
          !newAddress.state
        ) {
          alert("Please fill in all required address fields.");
          return;
        }

        // Create new address
        const saved = await addressService.createAddress(newAddress);
        console.log("New address saved:", saved);
      }

      navigate("/checkout/payment");
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Failed to save address.");
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-left">
        <h2>Checkout</h2>
        <div className="step-title">1. Shipping Address</div>

        <div className="address-options">
          <label>
            <input
              type="radio"
              checked={useDefaultAddress}
              onChange={() => setUseDefaultAddress(true)}
              disabled={!defaultAddress}
            />
            Use default address
          </label>
          <label>
            <input
              type="radio"
              checked={!useDefaultAddress}
              onChange={() => setUseDefaultAddress(false)}
            />
            Add new address
          </label>
        </div>

        {useDefaultAddress && defaultAddress ? (
          <div className="default-address">
            <strong>{defaultAddress.fullName}</strong> <br />
            {defaultAddress.fullAddress} <br />
            📞 {defaultAddress.phoneNumber}
          </div>
        ) : (
          <div className="address-form">
            <input
              name="fullName"
              placeholder="Full Name"
              value={newAddress.fullName}
              onChange={handleNewAddressChange}
            />
            <input
              name="phoneNumber"
              placeholder="Phone Number"
              value={newAddress.phoneNumber}
              onChange={handleNewAddressChange}
            />
            <input
              name="alternatePhone"
              placeholder="Alternate Phone"
              value={newAddress.alternatePhone}
              onChange={handleNewAddressChange}
            />
            <input
              name="pincode"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={handleNewAddressChange}
            />
            <input
              name="houseNumber"
              placeholder="House Number"
              value={newAddress.houseNumber}
              onChange={handleNewAddressChange}
            />
            <input
              name="street"
              placeholder="Street"
              value={newAddress.street}
              onChange={handleNewAddressChange}
            />
            <input
              name="landmark"
              placeholder="Landmark"
              value={newAddress.landmark}
              onChange={handleNewAddressChange}
            />
            <input
              name="city"
              placeholder="City"
              value={newAddress.city}
              onChange={handleNewAddressChange}
            />
            <input
              name="state"
              placeholder="State"
              value={newAddress.state}
              onChange={handleNewAddressChange}
            />
            <input
              name="country"
              placeholder="Country"
              value={newAddress.country}
              onChange={handleNewAddressChange}
            />
            <select
              name="addressType"
              value={newAddress.addressType}
              onChange={handleNewAddressChange}
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
            <label>
              <input
                type="checkbox"
                name="isDefault"
                checked={newAddress.isDefault}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    isDefault: e.target.checked,
                  })
                }
              />
              Set as default
            </label>
          </div>
        )}

        <button className="continue-btn" onClick={handleContinue}>
          Continue to Payment
        </button>
      </div>

      <div className="checkout-right">
        <h3>Summary</h3>
        <input className="promo-input" placeholder="Enter promo code" />
        <div className="summary-values">
          <div>
            Subtotal: ₹
            {cartItems
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toFixed(2)}
          </div>
          <div>Shipping: FREE</div>
          <div>
            <strong>
              Total: ₹
              {cartItems
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </strong>
          </div>
        </div>

        <h4>🛒 Cart ({cartItems.length} items)</h4>
        {cartItems.map((item) => (
          <div key={item.productId} className="cart-item">
            <img
              src={`${imageBaseURL}${item.productId}`}
              alt={item.productName}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/60";
              }}
            />
            <div className="cart-details">
              <div>{item.productName}</div>
              <div>
                ₹{item.price.toFixed(2)} x {item.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checkout;
