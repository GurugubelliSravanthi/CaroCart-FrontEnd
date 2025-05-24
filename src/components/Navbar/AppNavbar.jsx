import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./AppNavbar.css"; // Import the CSS file for custom styles

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

const AppNavbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("carocart_token");
    if (!token) {
      setUserName(null);
      return;
    }

    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp || decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("carocart_token");
      setUserName(null);
      return;
    }

    if (decoded.firstName && decoded.lastName) {
      setUserName(`${decoded.firstName} ${decoded.lastName}`);
    } else if (decoded.sub) {
      setUserName(decoded.sub);
    }
  }, []);

  const handleLoginClick = () => navigate("/login");
  const handleLogout = () => {
    localStorage.removeItem("carocart_token");
    setUserName(null);
    navigate("/login");
  };
  const handleProfile = () => navigate("/profile");

  return (
    <Navbar
      bg=""
      variant=""
      expand="lg"
      sticky="top"
      className="navbar-military"
    >
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="navbar-brand-custom"
        >
          <span className="navbar-logo">🛒</span> CaroCart
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="carocart-navbar-nav" />
        <Navbar.Collapse id="carocart-navbar-nav">
          <Nav className="ms-auto">
            {!userName ? (
              <Button
                variant="outline-light"
                onClick={handleLoginClick}
                className="nav-login-btn"
              >
                Login / Sign Up
              </Button>
            ) : (
              <NavDropdown
                title={userName}
                id="user-nav-dropdown"
                className="nav-dropdown-custom"
              >
                <NavDropdown.Item
                  onClick={handleProfile}
                  className="dropdown-item-custom"
                >
                  <i className="bi bi-person-fill me-2"></i>Profile
                </NavDropdown.Item>
                <NavDropdown.Divider className="dropdown-divider-custom" />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="dropdown-item-custom"
                >
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
