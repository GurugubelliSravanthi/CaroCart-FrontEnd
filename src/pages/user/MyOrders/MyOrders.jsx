import React, { useEffect, useState } from "react";
import orderService from "../../../services/orderService";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaSpinner, FaTimesCircle } from "react-icons/fa";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "badge badge-placed";
      case "CANCELLED":
        return "badge badge-cancelled";
      case "DELIVERED":
        return "badge badge-delivered";
      case "SHIPPED":
        return "badge badge-shipped";
      default:
        return "badge";
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirm) return;

    try {
      await orderService.cancelOrder(orderId);
      alert("Order cancelled successfully.");
      // Refresh the orders list
      const updatedOrders = await orderService.getMyOrders();
      setOrders(updatedOrders);
    } catch (err) {
      console.error("Failed to cancel order", err);
      alert("Failed to cancel the order.");
    }
  };

  return (
    <div className="orders-page">
      <h2>
        <FaBoxOpen /> My Orders
      </h2>

      {loading ? (
        <div className="loading-spinner">
          <FaSpinner className="spinner" />
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate("/")}>Start Shopping</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.orderId}>
              <div className="order-header">
                <span>
                  <strong>Order ID:</strong> {order.orderId}
                </span>
                <span>
                  <strong>Date:</strong>{" "}
                  {new Date(order.orderDate).toLocaleString()}
                </span>
              </div>

              <div className="order-items">
                {order.orderItems?.map((item) => (
                  <div className="order-item" key={item.productId}>
                    <div className="order-item-details">
                      <strong>{item.productName}</strong>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.price.toFixed(2)}</p>
                    </div>
                    <img
                      src={`http://localhost:8082/products/image/${item.productId}`}
                      alt={item.productName}
                      className="order-item-img"
                    />
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <p>
                  <strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}
                </p>
                <p>
                  <strong>Shipping:</strong> {order.shippingAddress}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </p>

                {order.status === "PLACED" && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => handleCancelOrder(order.orderId)}
                  >
                    <FaTimesCircle style={{ marginRight: "6px" }} />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
