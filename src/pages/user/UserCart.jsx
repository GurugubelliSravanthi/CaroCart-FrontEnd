import React, { useEffect, useState, useRef } from "react";
import cartService from "../../services/cartService";
import "./UserCart.css";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [isClearing, setIsClearing] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
  const updateTimeouts = useRef({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/user/login");
      return;
    }
    fetchCartItems();
  }, [navigate]);

  const fetchCartItems = async () => {
    try {
      const data = await cartService.getCartItems();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleQuantityChange = (productId, change) => {
    setCartItems((prev) =>
      prev.map((ci) =>
        ci.productId === productId
          ? { ...ci, quantity: Math.max(1, ci.quantity + change) }
          : ci
      )
    );

    // Clear any existing timeout
    if (updateTimeouts.current[productId]) {
      clearTimeout(updateTimeouts.current[productId]);
    }

    // Debounce update to backend by 500ms
    updateTimeouts.current[productId] = setTimeout(() => {
      const item = cartItems.find((ci) => ci.productId === productId);
      if (item) {
        updateCartQuantity(productId, Math.max(1, item.quantity + change));
      }
    }, 500);
  };

  const updateCartQuantity = async (productId, quantity) => {
    setLoadingIds((prev) => new Set(prev).add(productId));
    try {
      await cartService.updateCartItem(productId, quantity);
    } catch (error) {
      console.error("Error updating cart item:", error);
    } finally {
      setLoadingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(productId);
        return copy;
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    setLoadingIds((prev) => new Set(prev).add(productId));
    try {
      await cartService.removeCartItem(productId);
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setLoadingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(productId);
        return copy;
      });
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await cartService.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      navigate("/checkout");
      setIsCheckingOut(false);
    }, 1000);
  };

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>
          <FiShoppingCart /> Your Shopping Cart
        </h1>
        <p className="cart-items-count">{getTotalItems()} items in your cart</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-content">
            <FiShoppingCart size={48} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet</p>
            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-container">
            <div className="cart-items-header">
              <span>Product</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => {
                const isLoading = loadingIds.has(item.productId);
                return (
                  <div key={item.productId} className="cart-item">
                    <div className="product-info">
                      <div className="product-image">
                        <img
                          src={`http://localhost:8082/products/image/${item.productId}`}
                          alt={item.productName}
                        />
                      </div>
                      <div className="product-details">
                        <h3>{item.productName}</h3>
                        <p>₹{item.price.toFixed(2)}</p>
                        <button
                          className="remove-item-btn"
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <FaSpinner className="spinner" />
                          ) : (
                            <>
                              <FiTrash2 /> Remove
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="quantity-control">
                      <button
                        onClick={() => handleQuantityChange(item.productId, -1)}
                        disabled={isLoading || item.quantity <= 1}
                      >
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, 1)}
                        disabled={isLoading}
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <div className="item-total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-actions">
              <button
                className="clear-cart-btn"
                onClick={handleClearCart}
                disabled={isClearing}
              >
                {isClearing ? (
                  <FaSpinner className="spinner" />
                ) : (
                  <>
                    <FiTrash2 /> Clear Cart
                  </>
                )}
              </button>
              <button
                className="continue-shopping-btn"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({getTotalItems()} items)</span>
              <span>₹{getTotalPrice()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{getTotalPrice()}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <FaSpinner className="spinner" />
              ) : (
                "Proceed to Checkout"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCart;
