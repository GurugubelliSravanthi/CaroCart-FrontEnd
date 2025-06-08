import React, { useEffect, useState } from "react";
import cartService from "../../../services/cartService";
import orderService from "../../../services/orderService";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiLoader } from "react-icons/fi";
import './Checkout.css';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ New state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await cartService.getCartItems();
        if (items.length === 0) {
          alert("Your cart is empty. Please add items before checking out.");
          navigate("/");
          return;
        }
        setCartItems(items);
      } catch (err) {
        console.error("Error fetching cart items", err);
        setError("Failed to load cart items.");
      }
    };

    fetchCart();
  }, [navigate]);

  const getTotalPrice = () => {
    return cartItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      alert("Please enter your shipping address.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(""); // reset

    const orderRequest = {
      shippingAddress,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      await orderService.placeOrder(orderRequest);
      setSuccessMessage("Order Placed ✅"); // ✅ Show top message
      await cartService.clearCart();
      setTimeout(() => navigate("/orders/my"), 1500); // Redirect after short delay
    } catch (err) {
      console.error("Order placement failed", err);
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      {/* ✅ Top message */}
      {successMessage && (
        <div className="success-message" style={{ color: "green", marginBottom: "1rem" }}>
          {successMessage}
        </div>
      )}
      {error && (
        <div className="error-message" style={{ color: "red", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <h2>
        <FiShoppingCart /> Checkout
      </h2>

      <div className="order-summary">
        <h3>Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.productId} className="order-item">
            <span>
              {item.productName} x {item.quantity}
            </span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="order-total">
          <strong>Total: ₹{getTotalPrice()}</strong>
        </div>
      </div>

      <div className="shipping-address">
        <label htmlFor="shippingAddress">Shipping Address:</label>
        <textarea
          id="shippingAddress"
          rows="4"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Enter your shipping address"
          disabled={loading}
        />
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="place-order-btn"
      >
        {loading ? <FiLoader className="spinner" /> : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;
