import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatPanel from "../components/ChatPanel";
import { ThemeContext } from "../components/ThemeContext";
import { ImSun } from "react-icons/im";
import { LuMoon } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";

function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) navigate("/");
    else setCurrentUser(JSON.parse(storedUser));
  }, [navigate]);

  // Update last message in sidebar
  useEffect(() => {
    setUsers((prev) =>
      prev.map((user) => ({
        ...user,
        lastMessage:
          messages[user.id]?.[messages[user.id].length - 1]?.text || "",
      })),
    );
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    fetch("http://127.0.0.1:8000/api/getAllUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data);
        if (data.data.length > 0) setSelectedUser(data.data[0].id);
      })
      .catch(console.log);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div
      className={`h-screen flex ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          <FiSettings
            className={`w-6 h-6 ${theme === "dark" ? "text-white" : "text-black"}`}
          />
        </button>

        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className={`mt-2 w-40 p-3 rounded-xl shadow-lg absolute right-0 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          >
            <button
              onClick={toggleTheme}
              className="w-full text-left px-2 py-1 hover:bg-gray-700 dark:hover:bg-gray-300 dark:hover:text-black rounded"
            >
              {theme === "dark" ? (
                <>
                  <LuMoon /> Light Mode
                </>
              ) : (
                <>
                  <ImSun /> Dark Mode
                </>
              )}
            </button>
            <hr className="my-2 border-gray-500 dark:border-gray-300" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-2 py-1 hover:bg-red-500 hover:text-white rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        currentUser={currentUser}
      />
      <ChatPanel
        users={users}
        user={currentUser}
        selectedUser={selectedUser}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}

export default Home;
