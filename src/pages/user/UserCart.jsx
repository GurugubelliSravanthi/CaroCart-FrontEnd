import React, { useEffect, useState } from "react";
import cartService from "../../services/cartService";
import "./UserCart.css"; // Create for styles if needed
import { useNavigate } from "react-router-dom";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // ⬇️ Fetch user ID from token or localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/user/login");
      return;
    }
    setUserId(user.id);
    fetchCartItems(user.id);
  }, []);

  const fetchCartItems = async (uid) => {
    try {
      const data = await cartService.getCartItems(uid);
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await cartService.updateCartItem(userId, productId, quantity);
      fetchCartItems(userId);
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartService.removeCartItem(userId, productId);
      fetchCartItems(userId);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart(userId);
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId}>
                  <td>
                    <img
                      src={`http://localhost:8082/products/image/${item.productId}`}
                      alt={item.productName}
                      className="cart-img"
                    />
                  </td>
                  <td>{item.productName}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.productId,
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td>₹{item.price}</td>
                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleRemoveItem(item.productId)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h3>Total: ₹{getTotalPrice()}</h3>
            <button onClick={handleClearCart}>Clear Cart</button>
            {/* Checkout button can be added here */}
          </div>
        </>
      )}
    </div>
  );
};

export default UserCart;
