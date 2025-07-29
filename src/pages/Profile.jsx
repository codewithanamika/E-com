import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link } from "react-router-dom";


const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
      setOrdersLoading(false);
    };

    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">You must be logged in to view this page.</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt="Profile Picture"
          className="w-24 h-24 rounded-full mb-4 mx-auto"
        />
      )}
      <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>
      <div className="border p-4 rounded shadow space-y-2 mb-6">
        <p><strong>Display Name:</strong> {user.displayName || "N/A"}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>UID:</strong> {user.uid}</p>
        <p><strong>Logged in via:</strong> {user.providerData[0]?.providerId}</p>
      </div>

      <button
        onClick={handleLogout}
        className="mb-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 block mx-auto"
      >
        Logout
      </button>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Orders</h2>
        {ordersLoading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
  {orders.map(order => (
    <li key={order.id}>
      <Link to={`/orders/${order.id}`} className="text-blue-600 hover:underline">
        Order #{order.id}
      </Link>{" "}
      — Total: ${order.total?.toFixed(2)} — Status: {order.status}
    </li>
  ))}
</ul>
        )}
      </div>
    </div>
  );
};

export default Profile;
