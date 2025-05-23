import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: "Approve Vendors",
      description: "Review and approve pending vendor applications",
      icon: "👨‍💼",
      path: "/admins/vendors/pending",
      variant: "primary",
    },
    {
      title: "Manage Products",
      description: "View, edit or remove existing products",
      icon: "📦",
      path: "/admins/products",
      variant: "success",
    },
    {
      title: "Add Product",
      description: "Create new product listings",
      icon: "➕",
      path: "/admins/products/add",
      variant: "info",
    },
  ];

  return (
    <Container fluid className="admin-dashboard">
      <Row className="mb-4">
        <Col>
          <h2 className="dashboard-title">Admin Dashboard</h2>
          <p className="dashboard-subtitle">Manage your logistics operations</p>
        </Col>
      </Row>

      <Row className="g-4">
        {dashboardCards.map((card, index) => (
          <Col key={index} md={6} lg={4}>
            <Card
              className="dashboard-card h-100"
              onClick={() => navigate(card.path)}
            >
              <Card.Body className="text-center">
                <div className="card-icon">{card.icon}</div>
                <Card.Title className="card-title">{card.title}</Card.Title>
                <Card.Text className="card-text">{card.description}</Card.Text>
                <Button
                  variant={card.variant}
                  className="card-button"
                  onClick={() => navigate(card.path)}
                >
                  Go to {card.title}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDashboard;
