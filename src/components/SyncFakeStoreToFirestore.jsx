import { useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

const SyncFakeStoreToFirestore = () => {
  useEffect(() => {
    const fetchAndSave = async () => {
      try {
        // Fetch products from FakeStore API
        const res = await fetch("https://fakestoreapi.com/products");
        const products = await res.json();

        // Check if Firestore already has products to avoid duplicates
        const snapshot = await getDocs(collection(db, "products"));
        if (!snapshot.empty) {
          console.log("Firestore already has products, skipping sync.");
          return;
        }

        // Save each product into Firestore
        for (const product of products) {
          await addDoc(collection(db, "products"), {
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            image: product.image,
          });
        }

        console.log("Synced FakeStore products to Firestore!");
      } catch (error) {
        console.error("Error syncing products:", error);
      }
    };

    fetchAndSave();
  }, []);

  return <p>Syncing FakeStore products to Firestore... Check console for status.</p>;
};

export default SyncFakeStoreToFirestore;
