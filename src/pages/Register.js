import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setForm({
        ...form,
        image: file,
      });
      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 200) {
          navigate("/");
        } else {
          alert("Register Failed!!");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl text-white w-80">
        <h1 className="text-2xl mb-6 text-blue-400 ">Register</h1>

        <form onSubmit={handleRegister}>
          <div className="flex justify-center mb-6">
            <label className="relative cursor-pointer group">
              {/* Avatar Circle */}
              <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden border-2 border-blue-500 relative transition duration-300 group-hover:scale-105">
                {/* Image or Default Avatar */}
                <img
                  src={
                    preview
                      ? preview
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                </div>

                {/* Remove Button */}
                {preview && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreview(null);
                      setForm({ ...form, image: null });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full mb-4 p-2 rounded bg-gray-700"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 p-2 rounded bg-gray-700"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-4 p-2 rounded bg-gray-700"
          />

          <button type="submit" className="w-full bg-blue-500 p-2 rounded">
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-green-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
