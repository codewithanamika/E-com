import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const AddProductForm = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !image) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        title,
        price: parseFloat(price),
        image,
      });

      alert("✅ Product added!");
      setTitle("");
      setPrice("");
      setImage("");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <input
        className="border p-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Product Title"
      />
      <input
        className="border p-2 w-full"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        type="number"
      />
      <input
        className="border p-2 w-full"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Image URL"
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
        Add Product
      </button>
    </form>
  );
};

export default AddProductForm;
