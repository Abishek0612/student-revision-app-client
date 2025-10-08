import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getChats,
  createChat,
  sendMessage,
  deleteChat,
  setCurrentChat,
} from "../../features/chat/chatSlice";
import { FiSend, FiPlus, FiTrash2, FiMessageSquare } from "react-icons/fi";

function ChatInterface({ selectedPdfs }) {
  const dispatch = useDispatch();
  const { chats, currentChat, isLoading } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");
  const [showChatList, setShowChatList] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(getChats());
  }, [dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewChat = () => {
    dispatch(
      createChat({
        pdfId: selectedPdfs.length > 0 ? selectedPdfs[0]._id : null,
        title: "New Chat",
      })
    );
    setShowChatList(false);
  };

  const handleSelectChat = (chat) => {
    dispatch(setCurrentChat(chat));
    setShowChatList(false);
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      dispatch(deleteChat(chatId));
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChat) return;

    const pdfIds = selectedPdfs.map((pdf) => pdf._id);

    dispatch(
      sendMessage({
        chatId: currentChat._id,
        message: message.trim(),
        pdfIds: pdfIds.length > 0 ? pdfIds : null,
      })
    );

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full">
      <div
        className={`${
          showChatList ? "w-full md:w-80" : "w-0 md:w-80"
        } border-r border-gray-200 transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleNewChat}
            className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <FiPlus /> New Chat
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-76px)]">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <FiMessageSquare className="mx-auto text-4xl mb-2 opacity-50" />
              <p className="text-sm">No chats yet. Start a new conversation!</p>
            </div>
          ) : (
            <div className="p-2">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat)}
                  className={`group relative p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                    currentChat && currentChat._id === chat._id
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {chat.title}
                      </p>
                      {chat.pdf && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {chat.pdf.fileName}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(chat._id, e)}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-red-500 hover:bg-red-50 rounded transition-opacity"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {currentChat.title}
                </h3>
                {currentChat.pdf && (
                  <p className="text-sm text-gray-500">
                    {currentChat.pdf.fileName}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowChatList(!showChatList)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <FiMessageSquare />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentChat.messages && currentChat.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <FiMessageSquare className="mx-auto text-5xl mb-3 opacity-30" />
                    <p>Start a conversation with your AI teacher!</p>
                  </div>
                </div>
              ) : (
                currentChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] md:max-w-[70%] rounded-lg p-4 ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-xs font-semibold mb-2">
                            Citations:
                          </p>
                          {msg.citations.map((citation, i) => (
                            <div key={i} className="text-xs mb-2">
                              <span className="font-medium">
                                Page {citation.pageNumber}:
                              </span>{" "}
                              <span className="italic">
                                "{citation.snippet}"
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about your coursebooks..."
                  className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  rows="2"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="bg-blue-500 text-white px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FiMessageSquare className="mx-auto text-6xl mb-4 opacity-30" />
              <p className="text-lg">
                Select a chat or start a new conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatInterface;
