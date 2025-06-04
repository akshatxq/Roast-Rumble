"use client";

import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-4 border-b border-base-300 bg-base-100/50 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left: Avatar & Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <img
              src={
                selectedUser.profilePic ||
                `https://ui-avatars.com/api/?name=${
                  selectedUser?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2) || "U"
                }&background=6B46C1&color=fff&size=128`
              }
              alt={selectedUser.fullName}
              className="w-10 h-10 rounded-full border border-purple-300 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${
                  selectedUser?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2) || "U"
                }&background=6B46C1&color=fff&size=128`;
              }}
            />
          </div>

          {/* User Info */}
          <div className="text-sm">
            <h3 className="font-semibold text-gray-800 dark:text-white truncate">
              {selectedUser.fullName}
            </h3>
            <p className="text-xs text-zinc-500">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Right: Close Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-purple-100/30 transition-colors text-zinc-600 dark:text-zinc-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
