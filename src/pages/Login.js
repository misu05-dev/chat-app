import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("user", JSON.stringify(data.data.user));

          navigate("/home");
        } else {
          alert(data.message || "Login Failed");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl text-white w-80">
        <h1 className="text-2xl mb-6 text-green-400">Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full mb-4 p-2 rounded bg-gray-700"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="w-full mb-4 p-2 rounded bg-gray-700"
          />

          <button
            type="submit"
            className="w-full bg-green-500 p-2 rounded"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;