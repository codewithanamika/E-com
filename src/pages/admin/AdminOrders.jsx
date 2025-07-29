import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Link } from "react-router-dom";

const PAGE_SIZE = 5;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrev, setHasPrev] = useState(false);
  const [snapshotsStack, setSnapshotsStack] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async (direction = "initial") => {
    setLoading(true);

    let q;
    const ordersRef = collection(db, "orders");

    if (direction === "initial") {
      q = query(ordersRef, orderBy("createdAt", "desc"), limit(PAGE_SIZE));
    } else if (direction === "next" && lastVisible) {
      q = query(
        ordersRef,
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );
    } else if (direction === "prev" && snapshotsStack.length > 1) {
      const prev = snapshotsStack[snapshotsStack.length - 2];
      q = query(
        ordersRef,
        orderBy("createdAt", "desc"),
        startAfter(prev),
        limit(PAGE_SIZE)
      );
    }

    try {
      const snapshot = await getDocs(q);
      const fetchedOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(fetchedOrders);
      if (fetchedOrders.length) {
        setFirstVisible(snapshot.docs[0]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }

      if (direction === "next") {
        setSnapshotsStack((prev) => [...prev, lastVisible]);
        setHasPrev(true);
      } else if (direction === "prev") {
        setSnapshotsStack((prev) => prev.slice(0, -1));
        setHasPrev(snapshotsStack.length > 1);
      } else if (direction === "initial") {
        setSnapshotsStack([]);
        setHasPrev(false);
      }

      setHasNext(snapshot.size === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching paginated orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders("initial");
  }, []);

  const handleMarkAsDelivered = async (orderId) => {
    const confirm = window.confirm("Mark this order as delivered?");
    if (!confirm) return;

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: "delivered",
      });
      alert("Order marked as delivered.");
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "delivered" } : order
        )
      );
    } catch (error) {
      console.error("Error marking as delivered:", error);
      alert("Failed to update status. Try again.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-72"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredOrders.length ? (
        <ul className="space-y-4">
          {filteredOrders.map((order) => (
            <li
              key={order.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  Order #{order.id} — ${order.total?.toFixed(2)}
                </p>
                <p>
                  {order.name} ({order.email})
                </p>
                <p className="text-sm text-gray-600">
                  Status: {order.status}{" "}
                  {order.status === "shipped" && (
                    <button
                      onClick={() => handleMarkAsDelivered(order.id)}
                      className="ml-2 text-green-600 hover:underline"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </p>
              </div>
              <Link
                to={`/admin/orders/${order.id}`}
                className="text-blue-600 hover:underline"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default AdminOrders;
