// src/pages/payment/PaymentPage.jsx
import React, { useEffect } from "react";
import paymentService from "../../../services/paymentService";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get orderId passed from checkout page
  const orderId = location.state?.orderId;

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        const res = await paymentService.createOrder(1); // Rs. 1
        const order = res.data;

        if (!window.Razorpay) {
          alert("Razorpay SDK not loaded");
          return;
        }

        const options = {
          key: "rzp_test_72HbynYAImZFNi",
          amount: order.amount,
          currency: order.currency,
          name: "CaroCart",
          description: "Test Transaction",
          order_id: order.id,
          handler: async function (response) {
            alert("Payment Successful: " + response.razorpay_payment_id);

            try {
              // 🟢 Call backend to update payment status
              await axios.put(`http://localhost:8084/orders/${orderId}/payment`, null, {
                params: {
                  paymentId: response.razorpay_payment_id,
                  status: "PAID",
                },
              });

              alert("Order payment status updated!");
              navigate("/orders/my"); // Redirect to orders page
            } catch (error) {
              console.error("Failed to update payment status:", error);
              alert("Payment succeeded, but failed to update order status.");
            }
          },
          prefill: {
            name: "CaroCart User",
            email: "user@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error("Payment initiation failed", err);
        alert("Failed to start payment");
      }
    };

    initiatePayment();
  }, [orderId, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Processing Payment...</h2>
    </div>
  );
};

export default PaymentPage;
