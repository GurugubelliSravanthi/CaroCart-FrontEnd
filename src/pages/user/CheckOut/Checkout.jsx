import React, { useEffect, useState } from "react";
import cartService from "../../../services/cartService";
import orderService from "../../../services/orderService";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiLoader } from "react-icons/fi";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

    const orderRequest = {
      shippingAddress,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      await orderService.placeOrder(orderRequest);
      alert("Order placed successfully!");
      // Clear cart on frontend too
      await cartService.clearCart();
      navigate("/orders/my");
    } catch (err) {
      console.error("Order placement failed", err);
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (cartItems.length === 0) {
    return <div>Loading cart...</div>;
  }

  return (
    <div className="checkout-container">
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
