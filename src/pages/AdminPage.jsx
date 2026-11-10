import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    stock: "",
  });

  const token = localStorage.getItem("token");

  // Fetch products from the backend API
  function fetchProducts() {
    axios
      .get("http://localhost:8080/api/products/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Error Fetching Products");
        setLoading(false);
      });
  }

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input changes in the form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission for adding or editing a product
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    // Prepare the product data to be sent to the backend
    const productData = {
      name: form.name,
      description: form.description,
      price: form.price,
      imageUrl: form.imageUrl,
      category: form.category,
      stock: form.stock,
    };

    if (editingId) {
      // Update existing Product
      axios
        .put(`http://localhost:8080/api/products/${editingId}`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast.success("Product Updated Successfully");
          setEditingId(null);
          setForm({
            name: "",
            description: "",
            price: "",
            imageUrl: "",
            category: "",
            stock: "",
          });
          fetchProducts();
        })
        .catch((err) => {
          toast.error("Error Updating Product");
          setLoading(false);
        });
    } else {
      // Create new Product
      axios
        .post("http://localhost:8080/api/products", productData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast.success("Product Added Successfully");
          setForm({
            name: "",
            description: "",
            price: "",
            imageUrl: "",
            category: "",
            stock: "",
          });
          fetchProducts();
        })
        .catch((err) => {
          toast.error("Error Adding Products");
          setLoading(false);
        });
    }
  };

  function handleEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl:product.imageUrl,
      category: product.category,
      stock: product.stock,
    });
  }

  function handleDelete(id) {
    setLoading(true);
    axios
      .delete(`http://localhost:8080/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Product Deleted Successfully");
        fetchProducts();
      })
      .catch((err) => {
        toast.error("Failed to Delete Product");
        setLoading(false);
      });
  }

  function handleCancel() {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "",
      stock: "",
    });
  }

  return (
    <div className="adminPage">
      <h2 className="pageHeading" onClick={() => navigate("/products")}>E-Cart</h2>
      <Navbar />
      <h2 style={{marginTop: "20px"}}>Admin Dashboard</h2>

      {/* <p>Admin features coming soon</p> */}
      {/* Form that allows admin to manage users and products */}

      <div className="adminContainer">
        <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="adminFormGroup">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="adminFormGroup">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div className="adminFormGroup">
            <label htmlFor="price">Price</label>
            <input
              type="text"
              id="price"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
            />
          </div>
          <div className="adminFormGroup">
            <label htmlFor="imageURL">Image URL</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              placeholder="https://example.com/image.png"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>
          <div className="adminFormGroup">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
            />
          </div>
          <div className="adminFormGroup">
            <label htmlFor="stock">Stock</label>
            <input
              type="text"
              id="stock"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
            />
          </div>
          <div className="btn">
            <button type="submit">
              {editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* ================== Product List ================ */}
        <div className="productList">
          <h2>All Products</h2>
          <table className="productTable">
            <thead className="productTableHead">
              <tr className="productTableRow">
                <th className="productTableHeader">Name</th>
                <th className="productTableHeader">Category</th>
                <th className="productTableHeader">Price</th>
                <th className="productTableHeader">Stock</th>
                <th className="productTableHeader">Actions</th>
              </tr>
            </thead>
            <tbody className="productTableBody">
              {products.map((product) => (
                <tr className="productTableRow" key={product.id}>
                  <td className="productTableData">{product.name}</td>
                  <td className="productTableData">{product.category}</td>
                  <td className="productTableData">{product.price}</td>
                  <td className="productTableData">{product.stock}</td>
                  <td className="productTableData">{product.active ? "Active": "Inactive"}</td>
                  <td className="productTableData">
                    <button
                      className="tableBtn1"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="tableBtn2"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
