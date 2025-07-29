import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ProductListAdmin = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(items);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts(); // Refresh the list
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
  <div className="space-y-4">
    {products.map((p) => (
      <div
        key={p.id}
        className="border p-4 flex justify-between items-center rounded shadow"
      >
        <div>
          <h2 className="text-lg font-semibold">{p.title}</h2>
          <p>💵 ${p.price}</p>
          {p.image && <img src={p.image} alt="" className="w-24 mt-2" />}
        </div>

        <div className="space-x-2">
          {/* ✏️ Edit Button */}
          <button
            onClick={() => navigate(`/admin/edit-product/${p.id}`)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>

          {/* 🗑️ Delete Button */}
          <button
            onClick={() => handleDelete(p.id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
);
};

export default ProductListAdmin;
