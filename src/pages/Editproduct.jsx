import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditProduct = () => {
  const { id } = useParams(); // product ID from URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setPrice(data.price || "");
          setDescription(data.description || "");
          setImage(data.image || "");
        } else {
          alert("Product not found!");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    if (!title || !price) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        title,
        price,
        description,
        image,
      });
      alert("Product updated!");
      navigate("/admin"); // Go back to dashboard
    } catch (err) {
      alert("Failed to update product.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading product...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Product 🛠️</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Product Title"
        className="w-full p-2 border mb-2"
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        className="w-full p-2 border mb-2"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-2 border mb-2"
      ></textarea>

      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Image URL"
        className="w-full p-2 border mb-2"
      />

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-4 py-2 rounded mt-2"
      >
        Update Product
      </button>
    </div>
  );
};

export default EditProduct;
