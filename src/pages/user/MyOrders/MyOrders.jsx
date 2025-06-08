import React, { useEffect, useState } from "react";
import orderService from "../../../services/orderService";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaSpinner,
  FaTimesCircle,
  FaRupeeSign,
  FaTruck,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCreditCard,
} from "react-icons/fa";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/user/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        const sorted = data.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sorted);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const toggleItemDetails = (productId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "status-placed";
      case "CANCELLED":
        return "status-cancelled";
      case "DELIVERED":
        return "status-delivered";
      case "SHIPPED":
        return "status-shipped";
      case "OUT_FOR_DELIVERY":
        return "status-out-for-delivery";
      default:
        return "status-default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PLACED":
        return (
          <div className="status-icon placed-icon">
            <FaCalendarAlt />
          </div>
        );
      case "CANCELLED":
        return (
          <div className="status-icon cancelled-icon">
            <FaTimesCircle />
          </div>
        );
      case "DELIVERED":
        return (
          <div className="status-icon delivered-icon">
            <FaBoxOpen />
          </div>
        );
      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return (
          <div className="status-icon shipped-icon">
            <FaTruck />
          </div>
        );
      default:
        return (
          <div className="status-icon default-icon">
            <FaInfoCircle />
          </div>
        );
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      await orderService.cancelOrder(orderId);

      // Removed alert, refresh silently
      const updatedOrders = await orderService.getMyOrders();
      const sorted = updatedOrders.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
      setOrders(sorted);
    } catch (err) {
      console.error("Failed to cancel order", err);
      alert("Failed to cancel the order.");
    }
  };

  return (
    <div className="my-orders-container">
      <div className="orders-header">
        <h1>
          <FaBoxOpen /> My Orders
        </h1>
        <p className="orders-subtitle">View and manage your orders</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-orders-icon">
            <FaBoxOpen />
          </div>
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders yet.</p>
          <button className="primary-button" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.orderId}>
              <div
                className="order-summary"
                onClick={() => toggleOrderDetails(order.orderId)}
              >
                <div className="order-summary-left">
                  <div className="order-id-date">
                    <span className="order-id">Order #{order.orderId}</span>
                    <span className="order-date">
                      <FaCalendarAlt /> {formatDate(order.orderDate)}
                    </span>
                  </div>
                  <div className="order-total-items">
                    <span className="order-total">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                    <span className="order-items-count">
                      {order.orderItems?.length}{" "}
                      {order.orderItems?.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>
                <div className="order-summary-right">
                  <div className={`order-status ${getStatusClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status.replace(/_/g, " ")}</span>
                  </div>
                  <div className="order-toggle">
                    {expandedOrder === order.orderId ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </div>
              </div>

              {expandedOrder === order.orderId && (
                <div className="order-details">
                  <div className="order-items-section">
                    <h4>Order Items</h4>
                    <div className="order-items-list">
                      {order.orderItems?.map((item) => (
                        <div className="order-item" key={item.productId}>
                          <div className="item-image-container">
                            <img
                              src={`http://localhost:8082/products/image/${item.productId}`}
                              alt={item.productName}
                              className="order-item-img"
                              onClick={() =>
                                navigate(`/product/${item.productId}`)
                              }
                            />
                          </div>
                          <div className="item-details">
                            <h5
                              className="item-name"
                              onClick={() =>
                                navigate(`/product/${item.productId}`)
                              }
                            >
                              {item.productName}
                            </h5>
                            <div className="item-price-qty">
                              <span className="item-price">
                                ₹{item.price.toFixed(2)}
                              </span>
                              <span className="item-qty">
                                Qty: {item.quantity}
                              </span>
                            </div>
                            <div className="item-subtotal">
                              <span>
                                Subtotal: ₹
                                {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            <button
                              className="item-details-btn"
                              onClick={() => toggleItemDetails(item.productId)}
                            >
                              {expandedItems[item.productId] ? (
                                <>
                                  <FaChevronUp /> Hide details
                                </>
                              ) : (
                                <>
                                  <FaChevronDown /> View details
                                </>
                              )}
                            </button>
                            {expandedItems[item.productId] && (
                              <div className="item-description">
                                <p>
                                  {item.description ||
                                    "No description available."}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-info-sections">
                    <div className="order-info-section shipping-info">
                      <h4>
                        <FaMapMarkerAlt /> Shipping Information
                      </h4>
                      <div className="info-content">
                        <p>
                          <strong>Address:</strong> {order.shippingAddress}
                        </p>
                        <p>
                          <strong>Expected Delivery:</strong>{" "}
                          {formatDate(
                            new Date(order.orderDate).setDate(
                              new Date(order.orderDate).getDate() + 7
                            )
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="order-info-section payment-info">
                      <h4>
                        <FaCreditCard /> Payment Information
                      </h4>
                      <div className="info-content">
                        <p>
                          <strong>Payment Method:</strong>{" "}
                          {order.paymentMethod || "Credit/Debit Card"}
                        </p>
                        <p>
                          <strong>Total Amount:</strong> ₹
                          {order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="order-actions">
                    {order.status === "PLACED" && (
                      <>
                        <button
                          className="action-button track-button"
                          onClick={() =>
                            alert("Tracking not available yet")
                          }
                        >
                          <FaTruck /> Track Order
                        </button>
                        <button
                          className="action-button cancel-button"
                          onClick={() => handleCancelOrder(order.orderId)}
                        >
                          <FaTimesCircle /> Cancel Order
                        </button>
                      </>
                    )}
                    {order.status === "DELIVERED" && (
                      <button className="action-button return-button">
                        Request Return/Exchange
                      </button>
                    )}
                    <button className="action-button help-button">
                      Get Help with this Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
