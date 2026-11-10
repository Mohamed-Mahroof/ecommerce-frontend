import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

export const CartContext = createContext({
  items: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  fetchCart: async () => {},
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token],
  );

  const fetchCart = useCallback(async () => {
    if (!token) return;

    setLoading(true);

    try {
      const res = await axios.get("http://localhost:8080/api/cart", {
        headers,
      });
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch Cart", err);
    } finally {
      setLoading(false);
    }
  }, [headers, token]);

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      if (!token) return;

      setLoading(true);

      try {
        const res = await axios.get("http://localhost:8080/api/cart", {
          headers,
        });
        if (!cancelled) {
          setCart(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch Cart", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [headers, token]);

  async function addToCart(product, quantity = 1) {
    if (!token) return;

    try {
      const res = await axios.post(
        "http://localhost:8080/api/cart/add",
        { productId: product.id, quantity },
        { headers },
      );
      setCart(res.data);
    } catch (err) {
      console.error("Failed to add to Cart", err);
    }
  }

  async function updateQuantity(cartItemId, quantity) {
    if (!token) return;
    try {
      const res = await axios.put(
        `http://localhost:8080/api/cart/${cartItemId}`,
        { quantity },
        { headers },
      );
      setCart(res.data);
    } catch (err) {
      console.error("Failed to Update Quantity", err);
    }
  }

  async function removeFromCart(cartItemId) {
    if (!token) return;
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/cart/${cartItemId}`,
        { headers },
      );
      setCart(res.data);
    } catch (err) {
      console.error("Failed to Remove from Cart", err);
    }
  }

  async function clearCart() {
    if (!token) return;

    try {
      await axios.delete("http://localhost:8080/api/cart", { headers });
      setCart({ items: [] });
    } catch (err) {
      console.error("Failed to Clear Cart", err);
    }
  }

  const items = cart?.items || [];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        loading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
