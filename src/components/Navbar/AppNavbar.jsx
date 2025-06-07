import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa"; // cart icon
import axios from "axios";
import "./AppNavbar.css";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("Failed to parse JWT:", e);
    return null;
  }
}

const AppNavbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    const updateUserName = () => {
      const token = localStorage.getItem("carocart_token");
      if (!token) {
        setUserName(null);
        setProfileImageUrl(null);
        return;
      }

      const decoded = parseJwt(token);
      if (!decoded || !decoded.exp || decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("carocart_token");
        setUserName(null);
        setProfileImageUrl(null);
        return;
      }

      if (decoded.firstName) {
        setUserName(decoded.firstName);
      } else if (decoded.sub) {
        setUserName(decoded.sub);
      } else {
        setUserName(null);
      }

      // Load profile image when user is logged in
      if (decoded.firstName || decoded.sub) {
        loadProfileImage(token);
      }
    };

    updateUserName();

    window.addEventListener("carocart-login", updateUserName);
    window.addEventListener("carocart-logout", updateUserName);

    return () => {
      window.removeEventListener("carocart-login", updateUserName);
      window.removeEventListener("carocart-logout", updateUserName);
    };
  }, []);

  const loadProfileImage = async (token) => {
    try {
      const response = await axios.get("http://localhost:8081/users/profile/image", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const imageBlob = new Blob([response.data]);
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setProfileImageUrl(imageObjectURL);
    } catch (err) {
      console.log("No profile image found or error loading image:", err.response?.status);
      // Don't show error for 404 (no image found) - this is normal
      setProfileImageUrl(null);
    }
  };

  // Cleanup blob URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, [profileImageUrl]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginClick = () => navigate("/login");

  const handleLogout = () => {
    const token = localStorage.getItem("carocart_token");
    let role = null;

    if (token) {
      const decoded = parseJwt(token);
      role =
        decoded?.role ||
        decoded?.roles?.[0] ||
        decoded?.authorities?.[0]?.authority ||
        null;
    }

    localStorage.removeItem("carocart_token");
    setUserName(null);
    setProfileImageUrl(null);
    window.dispatchEvent(new Event("carocart-logout"));

    if (role === "ADMIN") {
      navigate("/admins/login");
    } else {
      navigate("/login");
    }
  };

  const handleProfile = () => navigate("/profile");

  return (
    <Navbar
      bg=""
      variant=""
      expand="lg"
      sticky="top"
      className={`navbar-military ${isScrolled ? "navbar-scrolled" : ""}`}
    >
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="navbar-brand-custom"
          style={{ cursor: "pointer" }}
        >
          <div className="navbar-logo-container">
            <span className="navbar-logo">🛒</span>
            <div className="navbar-logo-glow"></div>
          </div>
          <span className="navbar-brand-text">CaroCart</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="carocart-navbar-nav"
          className="navbar-toggler-custom"
        >
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="carocart-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {userName && (
              <Nav.Link
                as={Link}
                to="/user/cart"
                className="me-3"
                title="My Cart"
                style={{ fontSize: "1.3rem", color: "white" }}
              >
                <FaShoppingCart />
              </Nav.Link>
            )}

            {!userName ? (
              <Button
                variant="outline-light"
                onClick={handleLoginClick}
                className="nav-login-btn"
              >
                <span className="btn-text">Login / Sign Up</span>
                <div className="btn-shine"></div>
              </Button>
            ) : (
              <NavDropdown
                title={
                  <div className="user-dropdown-title">
                    <div className="user-avatar">
                      {profileImageUrl ? (
                        <img 
                          src={profileImageUrl} 
                          alt="Profile" 
                          className="user-avatar-image"
                          onError={() => setProfileImageUrl(null)}
                        />
                      ) : (
                        userName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="user-name">{userName}</span>
                  </div>
                }
                id="user-nav-dropdown"
                className="nav-dropdown-custom"
              >
                <NavDropdown.Item
                  onClick={handleProfile}
                  className="dropdown-item-custom"
                >
                  <div className="dropdown-icon">
                    <i className="bi bi-person-fill"></i>
                  </div>
                  <span>Profile</span>
                </NavDropdown.Item>
                <NavDropdown.Divider className="dropdown-divider-custom" />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="dropdown-item-custom logout-item"
                >
                  <div className="dropdown-icon">
                    <i className="bi bi-box-arrow-right"></i>
                  </div>
                  <span>Logout</span>
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