import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Sort ascending by date so order #1 is genuinely the user's first order
        const sorted = [...res.data].sort(
          (a,b) => new Date(a.orderDate) - new Date(b.orderDate)
        );
        setOrders(sorted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function handleCancelOrder(orderId) {
    const token = localStorage.getItem("token");

    axios
      .put(
        `http://localhost:8080/api/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        toast.success("Order Cancelled Successfully");
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: "CANCELLED" } : order,
          ),
        );
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to Cancel Order");
        setLoading(false);
      });
  }

  if (loading)
    return (
      <div>
        <Navbar />
        <h2>Loading Orders...</h2>
      </div>
    );
  if (error)
    return (
      <div>
        <Navbar />
        <h2>{error}</h2>
      </div>
    );

  if (orders.length === 0) {
    return (
      <div>
        <Navbar />
        <h2>No Orders Yet</h2>
      </div>
    );
  }

  return (
    <div className="OrdersPage">
      <Navbar />
      <h2>My Orders</h2>

      <div className="myOrders">
        {orders.map((order, index) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>Order #{index + 1}</h2>

              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <span
                  style={{
                    backgroundColor:
                      order.status === "Cancelled" ? "red" : "green",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "20px",
                  }}
                >
                  {order.status}
                </span>
                {order.status === "Placed" && (
                  <button
                    className="cancelBtn"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
            <p>Total: ${order.totalAmount.toFixed(2)}</p>

            <h3>Items:</h3>
            <table
              className=""
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #333" }}>
                  <th style={{ padding: "8px", textAlign: "left" }}>Product</th>
                  <th style={{ padding: "8px" }}>Quantity</th>
                  <th style={{ padding: "8px" }}>Price</th>
                  <th style={{ padding: "8px" }}>SubTotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
