import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-900">Spotcheck</Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to="/favorites"
                className="px-4 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                Favorites
              </Link>
              <span className="text-gray-700 hidden sm:inline">Hi, {user.first_name || user.username || user.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
