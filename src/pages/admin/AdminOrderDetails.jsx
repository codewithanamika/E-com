import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [ newStatus, setNewStatus ] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
          setNewStatus(doc.Snap.data().status || "");
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

  const handleUpdateStatus = async () => {
    if (!newStatus) return;

    setUpdating(true);
    try {
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, { status: newStatus });
      setOrder((prev) => ({ ...prev, status: newStatus }));
      alert("Order status updated.");
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-6">Loading order...</p>;
  if (!order) return <p className="p-6">Order not found.</p>;

  
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <p className="mb-2"><strong>ID:</strong> {order.id}</p>
      <p className="mb-2"><strong>Customer:</strong> {order.name}</p>
      <p className="mb-2"><strong>Total:</strong> ${order.total?.toFixed(2)}</p>
      <p className="mb-2"><strong>Current Status:</strong> {order.status}</p>

      <div className="mb-4 mt-4">
        <label className="block font-semibold mb-1">Update Status:</label>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select a status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={handleUpdateStatus}
          disabled={updating || newStatus === order.status}
          className={`ml-4 px-4 py-2 rounded text-white ${
            updating ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {updating ? "Updating..." : "Update"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Items Ordered</h2>
      <ul className="space-y-2">
        {order.items?.map((item, index) => (
          <li key={index} className="border p-3 rounded shadow-sm">
            <p className="font-medium">{item.title}</p>
            <p>Quantity: {item.qty}</p>
            <p>Price: ${item.price} × {item.qty} = ${(item.price * item.qty).toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrderDetails;