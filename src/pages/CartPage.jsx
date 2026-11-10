import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/useCart";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalAmount, loading } =
    useCart();
  const navigate = useNavigate();

  async function handlePlaceOrder() {
    const token = localStorage.getItem("token");

    const cartItems = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    try {
      await axios.post("http://localhost:8080/api/orders", cartItems, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await clearCart()
      toast.success("Order placed Successfully!")
      navigate("/orders")
    } catch {
      toast.error("Failed to place order")
    }
  }

  if (loading) return <div><Navbar /><h2>Loading...</h2></div>

  if (items.length === 0) {
    return (
      <div>
        <Navbar />
        <div
          className="emptyCart"
          style={{ textAlign: "center", marginTop: "50px" }}
        >
          <h2>Your cart is empty</h2>
          <button className="emptyCartBtn" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cartPage">
      <Navbar />
      <h1>Your Cart</h1>

      {/* ============= CART CONTAINER ============= */}
      <div className="cartContainer">
        {items.map((item) => (
          <div
            key={item.id}
            className="cartItem"
            style={{ backgroundColor: "blue" }}
          >
            {/* =============== CART IMAGE CONTAINER ================ */}
            <div className="imgContainer">
              <img
                src={
                  item.product.imageUrl ||
                  `https://placehold.co/120x120?text=${encodeURIComponent(item.name || "Product")}`
                }
                alt={item.product.name || "Product"}
              />
            </div>

            {/* =============== CART PRODUCT INFO ================ */}
            <div className="cartProductInfo">
              <h2>{item.product.name}</h2>
              <p>Price: ${item.product.price.toFixed(2)}</p>
              <p>Quantity: {item.product.quantity}</p>
              <p>Total: ${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>

            {/* ================ CART ACTION BUTTONS ============== */}
            <div className="cartBtnContainer">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          </div>
        ))}

        {/* ================= CART SUMMARY ================ */}
        <div className="cartSummary">
          <h2>Total: ${totalAmount.toFixed(2)}</h2>
          <div className="summbtnContainer">
            <button onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
            <button onClick={handlePlaceOrder}>Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
