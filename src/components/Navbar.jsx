import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow">
      <Link to="/" className="flex items-center space-x-2" />
        <img src={logo} alt="Logo" className="h-8 w-8" />
      <Link to="/" className="font-bold text-xl">MyShop</Link>
      <div className="space-x-4">
        <Link to="/cart">Cart</Link>
        {user ? (
          <>
            <span>{user.displayName}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
