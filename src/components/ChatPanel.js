import { useRef, useEffect, useState, useContext } from "react";
import { BsMic, BsEmojiSmileUpsideDown, BsSendFill } from "react-icons/bs";
import { ThemeContext } from "../components/ThemeContext";
import { io } from "socket.io-client";

// Socket singleton
const socket = io("http://localhost:5000");

function ChatPanel({ user, selectedUser, users, messages, setMessages }) {
  const { theme } = useContext(ThemeContext);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser, messages]);

  // Socket setup
  useEffect(() => {
    if (!user?.id) return;

    socket.emit("join", user.id);
    console.info(`User ${user.id} joined socket room`);

    const handleReceiveMessage = (data) => {
      console.info("Received message via socket:", data);
      const key = data.sender_id;

      setMessages((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), { text: data.message, sender: "other" }],
      }));
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [user, setMessages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    const messageText = input;
    setInput("");

    const newMsg = { text: messageText, sender: "me" };

    setMessages((prev) => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), newMsg],
    }));

    socket.emit("send_message", {
      sender_id: user.id,
      receiver_id: selectedUser,
      message: messageText,
    });

    // Send to Laravel API
    try {
      const res = await fetch("http://127.0.0.1:8000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: selectedUser,
          message: messageText,
        }),
      });
      const data = await res.json();
      console.info("Laravel API response:", data);
    } catch (err) {
      console.error("Failed to send message to API:", err);
    }
  };

  const selectedUserData = users.find((u) => u.id === selectedUser);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a user
      </div>
    );
  }

  const chatMessages = messages[selectedUser] || [];

  return (
    <div className={`flex-1 flex flex-col p-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
      {/* Header */}
      <div
        className={`p-4 font-semibold flex justify-between rounded-t-xl ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-200"
        }`}
      >
        {`${selectedUserData?.name || ""}`}
      </div>

      {/* Messages */}
      <div
        className={`flex-1 p-4 space-y-4 overflow-y-auto rounded-2xl ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] break-words ${
                msg.sender === "me"
                  ? "bg-green-500 text-white rounded-tr-sm"
                  : theme === "dark"
                  ? "bg-gray-400 text-white rounded-tl-sm"
                  : "bg-gray-300 text-black rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`p-3 rounded-b-xl ${theme === "dark" ? "bg-gray-900" : "bg-gray-200"}`}>
        <div className="flex items-center gap-3">
          <BsEmojiSmileUpsideDown
            className={`cursor-pointer w-6 h-6 ${theme === "dark" ? "text-green-500" : "text-green-700"}`}
          />
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className={`flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500"
                : "bg-white border-gray-400 text-black focus:ring-green-700"
            }`}
          />
          <button
            onClick={sendMessage}
            className={`px-4 py-2 rounded-full ${
              theme === "dark" ? "bg-green-500 text-white" : "bg-green-600 text-white"
            }`}
          >
            <BsSendFill />
          </button>
          <BsMic className={`cursor-pointer w-6 h-6 ${theme === "dark" ? "text-green-500" : "text-green-700"}`} />
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;