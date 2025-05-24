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
    {
      title: "Manage Categories",
      description: "Add/edit product categories and subcategories",
      icon: "🗂️",
      path: "/admins/categories/add",
      variant: "warning",
    },
    {
      title: "Order Management",
      description: "View and process customer orders",
      icon: "📝",
      path: "/admins/orders",
      variant: "danger",
    },
    {
      title: "Analytics",
      description: "View business performance metrics",
      icon: "📊",
      path: "/admins/analytics",
      variant: "dark",
    },
  ];

  return (
    <Container fluid className="admin-dashboard px-4 py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">
            Centralized management console for all administrative operations
          </p>
          <div className="dashboard-divider"></div>
        </Col>
      </Row>

      <Row className="g-4">
        {dashboardCards.map((card, index) => (
          <Col key={index} xs={12} sm={6} lg={4} xl={3}>
            <Card
              className="dashboard-card h-100 border-0"
              onClick={() => navigate(card.path)}
            >
              <Card.Body className="text-center p-4 d-flex flex-column">
                <div className="card-icon mb-3">{card.icon}</div>
                <Card.Title className="card-title mb-2">
                  {card.title}
                </Card.Title>
                <Card.Text className="card-text mb-4">
                  {card.description}
                </Card.Text>
                <Button
                  variant={card.variant}
                  className="card-button mt-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(card.path);
                  }}
                >
                  Access {card.title.split(" ")[0]}
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
