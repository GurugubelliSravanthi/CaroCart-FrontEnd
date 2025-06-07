import React, { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import { Card, Button, Modal } from "react-bootstrap";
import "./AdminOrderManagement.css";

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      await orderService.cancelOrderByAdmin(orderId);
      fetchOrders();
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Admin Order Management</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="d-grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p>
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p>
                    <strong>User ID:</strong> {order.userId}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{order.totalAmount}
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleViewDetails(order)}
                  >
                    View
                  </Button>

                  {order.status !== "CANCELLED" &&
                    order.status !== "CANCELLED BY ADMIN" && (
                      <Button
                        variant="danger"
                        onClick={() => handleCancel(order.id)}
                      >
                        Cancel
                      </Button>
                    )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal for Order Details */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Order #{selectedOrder?.id} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <>
              <p>
                <strong>Shipping Address:</strong>{" "}
                {selectedOrder.shippingAddress}
              </p>
              <p>
                <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
              </p>
              <p>
                <strong>Order Date:</strong> {selectedOrder.orderDate}
              </p>
              <div>
                <strong>Items:</strong>
                <ul>
                  {selectedOrder.orderItems.map((item, idx) => (
                    <li key={idx}>
                      {item.productName} - Qty: {item.quantity} - ₹
                      {item.totalPrice}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p>Loading details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminOrderManagement;
