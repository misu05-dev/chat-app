import DefaultAvatar from "../images/download (37).jpg";
import logo from "../images/logo.png";
import { ThemeContext } from "../components/ThemeContext";
import { useContext } from "react";

function Sidebar({ users, selectedUser, onSelectUser, currentUser }) {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="w-72 bg-gray-200 dark:bg-gray-900 text-black dark:text-white flex flex-col border-r border-gray-300 dark:border-gray-700">
      <div className="flex items-center">
        <img src={logo} className="w-20 h-full"/>
        <span className="font-bold">Chats</span>
      </div>
      <div className="px-4 py-2 flex flex-col items-center">
        <div className="text-gray-300 text-sm">Logged in as</div>
        {currentUser && (
          <div className="font-semibold mt-1">
            {currentUser.name} ({currentUser.id})
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800 ${
              selectedUser === user.id ? "bg-gray-700" : ""
            }`}
          >
            {/* Profile Image */}
            <img
              src={user.avatar || DefaultAvatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-gray-400 text-sm">
                {user.lastMessage || "No messages yet"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;