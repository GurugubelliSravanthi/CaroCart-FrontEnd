import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  NavDropdown,
  Badge,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
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

  useEffect(() => {
    const updateUserName = () => {
      const token = localStorage.getItem("carocart_token");
      if (!token) {
        setUserName(null);
        setUserRole(null);
        setCartCount(0);
        return;
      }

      const decoded = parseJwt(token);
      if (!decoded || !decoded.exp || decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("carocart_token");
        setUserName(null);
        setUserRole(null);
        setCartCount(0);
        return;
      }

      if (decoded.firstName) {
        setUserName(decoded.firstName);
      } else if (decoded.sub) {
        setUserName(decoded.sub);
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

    return () => {
      window.removeEventListener("carocart-login", updateUserName);
      window.removeEventListener("carocart-logout", updateUserName);
    };
  }, []);

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
              <NavDropdown
                title={
                  <div className="user-dropdown-title">
                    <div className="user-avatar">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name">{userName}</span>
                  </div>
                }
                id="user-nav-dropdown"
                className="nav-dropdown-custom"
              >
                {userRole === "USER" && (
                  <>
                    <NavDropdown.Item
                      as={Link}
                      to="/user/cart"
                      className="dropdown-item-custom"
                    >
                      <div className="dropdown-icon">
                        <FaShoppingCart />
                      </div>
                      <span>My Cart</span>
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/orders/my"
                      className="dropdown-item-custom"
                    >
                      <div className="dropdown-icon">
                        <FaClipboardList />
                      </div>
                      <span>My Orders</span>
                    </NavDropdown.Item>
                  </>
                )}

                <NavDropdown.Item
                  onClick={handleProfile}
                  className="dropdown-item-custom"
                >
                  <div className="dropdown-icon">
                    <FaUser />
                  </div>
                  <span>Profile</span>
                </NavDropdown.Item>

                <NavDropdown.Divider className="dropdown-divider-custom" />

                <NavDropdown.Item
                  onClick={handleLogout}
                  className="dropdown-item-custom logout-item"
                >
                  <div className="dropdown-icon">
                    <FaSignOutAlt />
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