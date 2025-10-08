import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">RevisionApp</Link>
        </div>
        <nav>
          <ul className="flex items-center space-x-6">
            {user ? (
              <>
                <li>
                  <span className="font-semibold">Welcome, {user.name}</span>
                </li>
                <li>
                  <button
                    onClick={onLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
