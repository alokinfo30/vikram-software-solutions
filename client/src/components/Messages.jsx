// client/src/components/Messages.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    fetchUsers();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle different response formats
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle different response formats - users might be in response.data.data
      const userList = Array.isArray(response.data) ? response.data : 
                       (Array.isArray(response.data?.data) ? response.data.data : []);
      // Filter out current user
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const filteredUsers = userList.filter(u => u._id !== currentUser._id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      // Use 'receiver' instead of 'receiverId' to match backend expectation
      const response = await axios.post('/api/messages', {
        receiver: selectedUser._id,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] bg-gray-700 rounded-lg shadow">
      {/* Users List - Hidden on mobile when chatting */}
      <div className={`${showUserList ? 'flex' : 'hidden'} lg:flex w-full lg:w-1/3 border-r border-gray-600 flex-col`}>
        <div className="p-4 border-b border-gray-600">
          <h2 className="font-bold text-white">Conversations</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {Array.isArray(users) && users.map(user => (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setShowUserList(false);
              }}
              className={`p-4 cursor-pointer hover:bg-gray-600 ${
                selectedUser?._id === user._id ? 'bg-gray-600' : ''
              }`}
            >
              <p className="font-medium text-white">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-400">{user.role}</p>
            </div>
          ))}
          {(!users || users.length === 0) && (
            <div className="p-4 text-gray-400">No users found</div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 flex flex-col ${!showUserList && selectedUser ? 'flex' : 'hidden'} lg:flex`}>
        {selectedUser ? (
          <>
            {/* Messages Header - Back button for mobile */}
            <div className="p-4 border-b border-gray-600 flex items-center">
              <button 
                onClick={() => setShowUserList(true)}
                className="lg:hidden mr-3 text-white"
              >
                ←
              </button>
              <h3 className="font-bold text-white">
                {selectedUser.firstName} {selectedUser.lastName}
              </h3>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4">
              {Array.isArray(messages) && messages.map(message => (
                <div
                  key={message._id}
                  className={`mb-4 flex ${
                    message.sender?._id === selectedUser._id 
                      ? 'justify-start' 
                      : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-sm p-3 rounded-lg ${
                      message.sender?._id === selectedUser._id
                        ? 'bg-gray-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ''}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-600">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-500 bg-gray-600 text-white rounded-l px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-r hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 p-4 text-center">
            Select a user to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
