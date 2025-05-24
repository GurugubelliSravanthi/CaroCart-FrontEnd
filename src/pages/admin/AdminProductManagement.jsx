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
      setError("Failed to load products.");
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
      setError("Delete failed.");
    }
  };

  const handleEdit = (product) => {
    navigate("/admins/products/add", { state: { product } });
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Product Management</h2>
        </Col>
        <Col className="text-end">
          <Button onClick={() => navigate("/admins/products/add")}>
            + Add Product
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p>Loading...</p>
        </div>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>SubCategory</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.brand}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stock}</td>
                    <td>{p.subCategory?.name}</td>
                    <td>
                      <Button size="sm" onClick={() => handleEdit(p)}>
                        Edit
                      </Button>{" "}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AdminProductManagement;
