import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase/firebase";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "Esewa",
  });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePlaceOrderClick = () => {
    setShowForm(true);
    setShowQR(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.email) {
      alert("Please fill in all customer details.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }

    const order = {
      userId: user.uid,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      paymentMethod: formData.paymentMethod,
      items: cartItems,
      total,
      status: formData.paymentMethod === "Cash on Delivery" ? "pending" : "awaiting payment",
      createdAt: serverTimestamp(),
    };

    console.log("Attempting to save order:", order);

    try {
      await addDoc(collection(db, "orders"), order);
      console.log("✅ Order saved to Firestore");

      if (formData.paymentMethod === "Cash on Delivery") {
        alert("Order placed successfully with Cash on Delivery!");
        clearCart();
        navigate("/");
      } else {
        setShowQR(true);
      }
    } catch (err) {
      console.error("❌ Failed to save order to Firestore:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 && !showQR ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : showForm && !showQR ? (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>

          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
          <textarea name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />

          <div>
            <label className="block mb-2 font-medium">Payment Method</label>
            <div className="space-y-2">
              {["Esewa", "Khalti", "Cash on Delivery"].map((method) => (
                <label key={method} className="block">
                  <input type="radio" name="paymentMethod" value={method} checked={formData.paymentMethod === method} onChange={handleInputChange} className="mr-2" />
                  {method}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Confirm Order
          </button>
        </form>
      ) : showQR ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Scan to Pay via {formData.paymentMethod}</h2>
          {formData.paymentMethod === "Esewa" && <img src="/path-to-your-esewa-qr.png" alt="Esewa QR Code" className="mx-auto w-64 h-64" />}
          {formData.paymentMethod === "Khalti" && <img src="/path-to-your-khalti-qr.png" alt="Khalti QR Code" className="mx-auto w-64 h-64" />}
          <button onClick={() => { alert("Thank you for your payment!"); clearCart(); navigate("/"); }} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            I Have Paid
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-gray-600 mb-2">${item.price} × {item.qty}</p>
                <input type="number" min="1" value={item.qty} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} className="w-20 border px-2 py-1 rounded" />
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:underline">
                Remove
              </button>
            </div>
          ))}

          <div className="text-right font-bold text-xl mt-6">
            Total: ${total.toFixed(2)}
          </div>

          <div className="text-right mt-4">
            <button onClick={handlePlaceOrderClick} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
