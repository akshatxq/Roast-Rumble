"use client";

import { useChatStore } from "../store/useChatStore.js";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100/50 backdrop-blur-sm">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100/50 backdrop-blur-sm">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            {/* Avatar */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border border-purple-200 shadow-sm overflow-hidden">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic ||
                        `https://ui-avatars.com/api/?name=${
                          authUser?.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2) || "U"
                        }&background=6B46C1&color=fff&size=128`
                      : selectedUser.profilePic ||
                        `https://ui-avatars.com/api/?name=${
                          selectedUser?.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2) || "U"
                        }&background=6B46C1&color=fff&size=128`
                  }
                  alt="profile pic"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${
                      (message.senderId === authUser._id
                        ? authUser?.fullName?.charAt(0)
                        : selectedUser?.fullName?.charAt(0)) || "U"
                    }&background=6B46C1&color=fff&size=128`;
                  }}
                />
              </div>
            </div>

            {/* Timestamp */}
            <div className="chat-header mb-1">
              <time className="text-xs text-zinc-400">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* Bubble */}
            <div
              className={`chat-bubble bg-purple-100 text-gray-800 dark:bg-purple-900 dark:text-white shadow-md rounded-lg px-4 py-2 space-y-2`}
            >
              {message.image && (
                <img
                  src={message.image || "/placeholder.svg"}
                  alt="Attachment"
                  className="rounded-md sm:max-w-[200px] border border-zinc-200"
                />
              )}
              {message.text && <p className="break-words">{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
