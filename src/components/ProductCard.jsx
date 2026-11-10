import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";

const ProductCard = ({
  id,
  name,
  description,
  price,
  imageUrl,
  category,
  stock,
}) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="productCard">
      <div className="imgContainer" onClick={() => navigate(`/products/${id}`)}>
        <img
          src={imageUrl || `https://placehold.co/200x150?text=${name}`}
          alt={name}
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        />
      </div>
      <h2>{name}</h2>
      <p>{description}</p>
      <p>Price: ${price.toFixed(2)}</p>
      <p>Category: {category}</p>
      <p>Stock: {stock}</p>
      <button
        onClick={() =>
          addToCart({ id, name, description, price, category, stock, imageUrl })
        }
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
