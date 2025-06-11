import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Badge,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";
import cartService from "../../services/cartService";
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
  const [userRole, setUserRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    const updateUserName = () => {
      const token = localStorage.getItem("carocart_token");
      if (!token) {
        setUserName(null);
        setUserRole(null);
        setCartCount(0);
        setProfileImageUrl(null);
        return;
      }

      const decoded = parseJwt(token);
      if (!decoded || !decoded.exp || decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("carocart_token");
        setUserName(null);
        setUserRole(null);
        setCartCount(0);
        setProfileImageUrl(null);
        return;
      }

      setUserName(decoded.firstName || decoded.sub || null);

      // Load profile image
      if (decoded.firstName || decoded.sub) {
        loadProfileImage(token, decoded);
      }

      const role =
        decoded?.role ||
        decoded?.roles?.[0] ||
        decoded?.authorities?.[0]?.authority ||
        null;
      setUserRole(role);
    };

    updateUserName();

    window.addEventListener("carocart-login", updateUserName);
    window.addEventListener("carocart-logout", updateUserName);
    window.addEventListener("carocart-profile-updated", updateUserName);

    return () => {
      window.removeEventListener("carocart-login", updateUserName);
      window.removeEventListener("carocart-logout", updateUserName);
      window.removeEventListener("carocart-profile-updated", updateUserName);
    };
  }, []);

  const loadProfileImage = async (token, decoded) => {
    try {
      const role = decoded?.role || decoded?.roles?.[0] || decoded?.authorities?.[0]?.authority || null;
      const endpoint = role === "ADMIN" 
        ? "http://localhost:8081/admins/profile/image"
        : "http://localhost:8081/users/profile/image";
        
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const imageBlob = new Blob([response.data]);
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setProfileImageUrl(imageObjectURL);
    } catch (err) {
      console.log("No profile image found or error loading image:", err.response?.status);
      setProfileImageUrl(null);
    }
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem("carocart_token");
        if (!token || userRole !== "USER") {
          setCartCount(0);
          return;
        }
        const cartItems = await cartService.getCartItems();
        const totalQuantity = cartItems.reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        );
        setCartCount(totalQuantity);
      } catch (error) {
        console.error("Error fetching cart count", error);
      }
    };

    fetchCartCount();
    window.addEventListener("carocart-cart-updated", fetchCartCount);

    return () => {
      window.removeEventListener("carocart-cart-updated", fetchCartCount);
    };
  }, [userRole]);

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
    setUserRole(null);
    setCartCount(0);
    setProfileImageUrl(null);
    window.dispatchEvent(new Event("carocart-logout"));

    navigate(role === "ADMIN" ? "/admins/login" : "/login");
  };

  const handleProfileClick = () => {
    if (userRole === "ADMIN") {
      navigate("/admins/profile");
    } else {
      navigate("/account");
    }
  };

  return (
    <Navbar
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
            {userName && userRole === "USER" && (
              <Nav.Link
                as={Link}
                to="/user/cart"
                className="me-3 position-relative"
                title="My Cart"
                style={{ fontSize: "1.3rem", color: "white" }}
              >
                <FaShoppingCart />
                {cartCount > 0 && (
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {cartCount}
                  </Badge>
                )}
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
              <div className="user-profile-section d-flex align-items-center gap-2">
  <div
    className="user-profile-clickable"
    onClick={handleProfileClick}
    style={{ cursor: "pointer" }}
  >
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

  {userRole === "ADMIN" && (
    <Button
      variant="outline-light"
      onClick={handleLogout}
      className="logout-btn"
      size="sm"
      title="Logout"
    >
      <FaSignOutAlt />
    </Button>
  )}
</div>

            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;