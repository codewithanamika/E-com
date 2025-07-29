import { useAuth } from "../context/AuthContext";
import AddProductForm from "../components/AddProductForm";
import ProductListAdmin from "../components/ProductListAdmin";

const AdminDashboard = () => {
  const { role, loading } = useAuth();

  if (loading) return <p>Checking admin access...</p>;
  if (role !== "admin") return <p>🚫 You are not authorized to view this page.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard 🛠️</h1>
      <AddProductForm />
      <ProductListAdmin />
    </div>
  );
};

export default AdminDashboard;
