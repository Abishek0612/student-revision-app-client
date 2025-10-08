import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset } from "../features/auth/authSlice";
import Spinner from "../components/common/Spinner";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }
    if (isSuccess || user) {
      navigate("/");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-full max-w-md mt-10">
        <section className="text-center mb-6">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-500">Please log in to continue</p>
        </section>
        <section>
          <form
            onSubmit={onSubmit}
            className="bg-white p-8 rounded-lg shadow-md space-y-6"
          >
            <input
              type="email"
              className="w-full p-3 border rounded-md"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
            />
            <input
              type="password"
              className="w-full p-3 border rounded-md"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;
