import React, { useState, useEffect } from "react";
import cartService from "../../../services/cartService";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    zip: "",
    city: "",
    state: "",
  });

  const navigate = useNavigate();

  // Change this to your backend/public URL where images are stored
  const imageBaseURL = "https://your-backend-url.com"; // Replace with your real base URL

  useEffect(() => {
    const fetchCart = async () => {
      const items = await cartService.getCartItems();
      if (items.length === 0) {
        alert("Cart is empty.");
        navigate("/");
        return;
      }
      setCartItems(items);
    };
    fetchCart();
  }, [navigate]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    // Add validation if needed
    navigate("/checkout/payment");
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-left">
        <h2>Checkout</h2>
        <div className="step-title">1. Shipping address</div>

        <div className="address-options">
          <label>
            <input
              type="radio"
              checked={useDefaultAddress}
              onChange={() => setUseDefaultAddress(true)}
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

        {!useDefaultAddress && (
          <div className="address-form">
            <div className="row">
              <input
                name="firstName"
                placeholder="First Name"
                value={address.firstName}
                onChange={handleChange}
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={address.lastName}
                onChange={handleChange}
              />
            </div>
            <input
              name="address1"
              placeholder="Address Line 1"
              value={address.address1}
              onChange={handleChange}
            />
            <input
              name="address2"
              placeholder="Address Line 2 (optional)"
              value={address.address2}
              onChange={handleChange}
            />
            <div className="row">
              <input
                name="zip"
                placeholder="ZIP Code"
                value={address.zip}
                onChange={handleChange}
              />
              <input
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
              />
              <input
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <button className="continue-btn" onClick={handleContinue}>
          Continue to payment
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
        {cartItems.map((item) => {
          console.log("Image URL:", item.image);
          return (
            <div key={item.productId} className="cart-item">
              <img
                src={
                  item.image
                    ? imageBaseURL + item.image // Add your base URL prefix here
                    : "https://via.placeholder.com/60"
                }
                alt={item.productName}
              />
              <div className="cart-details">
                <div>{item.productName}</div>
                <div>
                  ₹{item.price.toFixed(2)} x {item.quantity}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Checkout;