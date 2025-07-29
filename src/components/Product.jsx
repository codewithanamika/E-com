// src/components/Product.jsx
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";


const Product = ({ product }) => {
  const { addToCart } = useCart();

  console.log("✅ Product component rendered:", product);

  return (
    <div className="border p-4 rounded-xl shadow-md">
      {/* Wrap image + title in Link */}
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover rounded"
        />
        <h2 className="text-xl font-bold mt-2 hover:underline">{product.title}</h2>
      </Link>

      <p className="text-gray-700">${product.price}</p>
      <button
        onClick={() => {
          addToCart(product);
          
        }}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Product;
