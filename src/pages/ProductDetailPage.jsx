import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";

import { FiHome } from "react-icons/fi";
import { useCart } from "../context/useCart";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8080/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!cancelled) {
          setProduct(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load product");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // function handleAddToCart() {
  //   if (!product) return;
  //   addToCart({ ...product, quantity: 1 });
  //   toast.success("Added to Cart");
  // }

  // New Way to Add to Cart
  async function handleAddToCart() {
    await addToCart(product, quantity);
    toast.success("Added to cart!");
  }

  function handleBuyNow() {
    setShowPaymentMethod(true);
  }

  async function handlePlaceOrder() {
    if (!product) return;

    if (!selectedPayment) {
      toast.error("Choose a Payment Method");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios
        .post(
          `http://localhost:8080/api/orders`,
          [{ productId: product.id, quantity }],
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        await clearCart()
        setShowPaymentMethod(false);
        toast.success("Order Placed Successfully!");
        setTimeout(() => navigate("/orders"), 2000);
        
      }
      catch {
        toast.error("Failed to Place Order");
      }

  }

  if (loading) {
    return (
      <div className="productDetailPage">
        <Navbar />
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="productDetailPage">
        <Navbar />
        <h2>{error}</h2>
      </div>
    );
  }

  if (!product) return null;

  const imageSrc =
    product.imageUrl ||
    product.image ||
    product.imageURL ||
    product.imgUrl ||
    `https://placehold.co/400x400?text=${encodeURIComponent(product.name || "Product")}`;

  return (
    <div className="productDetailPage">
      <Navbar />

      {/* ============= Breadcrumb ============= */}
      <div className="breadCrumbsContainer">
        <div className="homeIcon" onClick={() => navigate("/products")}>
          <FiHome size={24} />
        </div>
        <div className="breadCrumbs">
          <span className="span1" onClick={() => navigate("/products")}>
            Products
          </span>
          <span className="span2"> &gt; </span>
          <span className="span3">{product.category}</span>
          <span className="span4"> &gt; </span>
          <span className="span5">{product.name}</span>
        </div>
      </div>

      {/* ============= Product Detail ============= */}
      <div className="productDetailContainer grid-container">
        {/* ============= Left Container - Product Image ============= */}
        <div
          className="leftImgContainer grid-item"
          style={{ gridArea: "image" }}
        >
          <img src={imageSrc} alt={product.name || "Product"} />
        </div>

        {/* ============= Right Container - Product Detail ============= */}
        <div
          className="productInfoContainer grid-item"
          style={{ gridArea: "info" }}
        >
          <h1 className="productName">{product.name}</h1>
          <p className="productDesc">{product.description}</p>
          <div id="productPrice">
            ${Number(product.price * quantity || 0).toFixed(2)}
          </div>
          <p className="productCategory">
            Category: <strong>{product.category}</strong>
          </p>
          <p
            className="productStock"
            style={{ color: product.stock > 0 ? "green" : "red" }}
          >
            {product.stock > 0
              ? `In Stock (${product.stock}) available`
              : "Out Of Stock"}
          </p>
        </div>

        {/* ============= Quantity ============= */}
        <div
          className="quantityContainer grid-item"
          style={{ gridArea: "quantity" }}
        >
          <span>Quantity: </span>
          <button onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}>
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() =>
              setQuantity((qty) => Math.min(product.stock, qty + 1))
            }
          >
            +
          </button>
        </div>

        {/* ============= Action Buttons ============= */}
        <div className="actionBtns grid-item" style={{ gridArea: "actions" }}>
          <button
            className="cartBtn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Add To Cart
          </button>
          <button
            className="buyBtn"
            onClick={handleBuyNow}
            disabled={product.stock === 0}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* ============= Payment Model ============= */}
      {showPaymentMethod && (
        <div className="paymentModel">
          <div className="paymentContainer">
            <h2>Select Payment Method</h2>

            {/* ------------ Order Summary ------------ */}
            <div className="orderSummary">
              <p>
                {product.name}*{quantity}
              </p>
              <p>Total: ${(product.price * quantity).toFixed(2)}</p>
            </div>

            {/* ------------ Payment Options ------------ */}
            <div className="paymentOptions">
              {[
                "UPI",
                "Credit / Debit Card",
                "Net Banking",
                "Cash On Delivery",
              ].map((method) => (
                <label
                key={method}
                  htmlFor={method}
                  style={{
                    border: `1px solid ${selectedPayment === method ? "#4CAF50" : "#333"}`,
                    backgroundColor:
                      selectedPayment === method
                        ? "rgba(76,175,80,0.1)"
                        : "transparent",
                  }}
                >
                  <input
                    id={method}
                    type="radio"
                    name="payment"
                    value={method}
                    checked={selectedPayment === method}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                  />
                  {method}
                </label>
              ))}
            </div>

            {/* ============= Model Buttons ============= */}
            <div className="modelBtns">
              <button
                onClick={() => setShowPaymentMethod(false)}
                className="btn1"
              >
                Cancel
              </button>
              <button onClick={handlePlaceOrder} className="btn2">
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
