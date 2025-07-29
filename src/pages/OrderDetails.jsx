import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    setIsCancelling(true);

    try {
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, { status: "cancelled" });
      alert("Order cancelled successfully.");
      setOrder({ ...order, status: "cancelled" }); // Update local state
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel the order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() }); // Include id for updating
        } else {
          console.error("No such order found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p className="p-6">Loading order...</p>;
  if (!order) return <p className="p-6">Order not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order #{id}</h1>
      <div className="space-y-2 mb-6">
        <p className={`font-semibold ${order.status === "cancelled" ? "text-red-600" : "text-gray-800"}`}>
          <strong>Status:</strong> {order.status}
        </p>
        <p><strong>Total:</strong> ${order.total?.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Customer:</strong> {order.name}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p><strong>Address:</strong> {order.address}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Items Ordered</h2>
      <ul className="space-y-4">
  {order.items?.length ? (
    order.items.map((item, index) => (
      <li
        key={index}
        className="flex items-center gap-4 border p-3 rounded shadow-sm"
      >
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div>
          <p className="font-medium">{item.title}</p>
          <p>Quantity: {item.qty}</p>
          <p>Price: ${item.price} x {item.qty} = ${(item.price * item.qty).toFixed(2)}</p>
        </div>
      </li>
    ))
  ) : (
    <p className="text-gray-500">No items found in this order.</p>
  )}
</ul>

      {order.status === "pending" && (
        <button
          disabled={isCancelling || order.status === "cancelled"}
          onClick={handleCancelOrder}
          className={`mt-4 px-4 py-2 rounded text-white ${
            isCancelling || order.status === "cancelled"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isCancelling ? "Cancelling..." : "Cancel Order"}
        </button>
      )}
    </div>
  );
};

export default OrderDetails;
