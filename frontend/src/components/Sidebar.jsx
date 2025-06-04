"use client"

import { useEffect, useState } from "react"
import { useChatStore } from "../store/useChatStore.js"
import { useAuthStore } from "../store/useAuthStore.js"
import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx"
import { Users } from "lucide-react"

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore()
  const { onlineUsers } = useAuthStore()
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users

  if (isUsersLoading) return <SidebarSkeleton />

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 bg-base-100/50 backdrop-blur-sm flex flex-col transition-all duration-200 shadow-md">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-purple-400" />
          <span className="font-semibold text-lg hidden lg:block text-gray-700 dark:text-gray-200">All Warriors</span>
        </div>

        {/* Online Filter */}
        <div className="mt-4 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            Show online only
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-3 px-2 space-y-1">
        {filteredUsers.map((user) => {
          const initials = user?.fullName
            ? user.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
            : "US"

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full flex items-center gap-3 rounded-xl px-3 py-2
                transition-all duration-200 hover:bg-purple-100/30 hover:scale-[1.01]
                ${selectedUser?._id === user._id ? "bg-purple-100/30 ring-1 ring-purple-300" : ""}
              `}
            >
              {/* Avatar */}
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={
                    user.profilePic ||
                    `https://ui-avatars.com/api/?name=${initials}&background=6B46C1&color=fff&size=128`
                  }
                  alt={user.fullName || "User"}
                  className="w-12 h-12 object-cover rounded-full border border-purple-300"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = `https://ui-avatars.com/api/?name=${initials}&background=6B46C1&color=fff&size=128`
                  }}
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                )}
              </div>

              {/* User Info */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate text-gray-800 dark:text-white">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          )
        })}

        {/* No User Message */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4 text-sm">No warriors online</div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
