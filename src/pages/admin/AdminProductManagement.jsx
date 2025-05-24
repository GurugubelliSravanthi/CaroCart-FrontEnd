import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import "./AdminProductManagement.css";

const API_BASE = "http://localhost:8082/products";

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("carocart_token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/all`);
      setProducts(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`${API_BASE}/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError("Failed to delete product. Please try again.");
    }
  };

  const handleEdit = (product) => {
    navigate("/admins/products/add", { state: { product } });
  };

  return (
    <Container fluid className="product-management">
      <Row className="mb-4">
        <Col>
          <h2 className="page-title">Product Management</h2>
          <p className="page-subtitle">
            View and manage all products in your inventory
          </p>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => navigate("/admins/products/add")}
            className="add-product-btn"
          >
            + Add New Product
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <Card className="no-products-card">
          <Card.Body className="text-center py-5">
            <h5>No products found</h5>
            <p className="text-muted">Start by adding your first product</p>
            <Button
              variant="primary"
              onClick={() => navigate("/admins/products/add")}
            >
              Add Product
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="products-table-card">
          <Card.Body>
            <div className="table-responsive">
              <Table hover className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="product-name">{p.name}</td>
                      <td className="product-desc">{p.description}</td>
                      <td className="product-price">₹{p.price}</td>
                      <td className="product-qty">{p.quantity}</td>
                      <td className="product-actions">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(p)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AdminProductManagement;
