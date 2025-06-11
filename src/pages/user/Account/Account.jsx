// src/pages/user/account/Account.jsx

import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { FaShoppingCart, FaClipboardList, FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Account .css";

const Account = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("carocart_token");
    window.dispatchEvent(new Event("carocart-logout"));
    navigate("/login");
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">My Account</h2>
      <Row xs={1} md={2} className="g-4">
        <Col>
          <Card className="account-card" onClick={() => navigate("/user/cart")}>
            <Card.Body className="text-center">
              <FaShoppingCart className="account-icon" />
              <Card.Title>My Cart</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="account-card" onClick={() => navigate("/orders/my")}>
            <Card.Body className="text-center">
              <FaClipboardList className="account-icon" />
              <Card.Title>My Orders</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="account-card" onClick={() => navigate("/profile")}>
            <Card.Body className="text-center">
              <FaUserEdit className="account-icon" />
              <Card.Title>Edit Profile</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="account-card" onClick={handleLogout}>
            <Card.Body className="text-center">
              <FaSignOutAlt className="account-icon text-danger" />
              <Card.Title className="text-danger">Logout</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Account;
