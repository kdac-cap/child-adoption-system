import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if (authUser) {
      setCurrentUser(authUser);
      loadUsers(authUser);
    }
  }, []);

  useEffect(() => {
    if (selectedUser && currentUser) {
      loadConversation();
      const interval = setInterval(loadConversation, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUser, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadUsers = async (authUser) => {
    try {
      const token = localStorage.getItem("authToken");
      let response;
      
      if (authUser.role === 'STAFF' || authUser.role === 'ADMIN') {
        // For staff/admin, get all conversations including new parent messages
        response = await axios.get(`${API_URL}/messages/all-conversations/${authUser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // For parents, use regular chat-users endpoint
        response = await axios.get(`${API_URL}/users/chat-users/${authUser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setUsers(response.data);
      
      if (response.data.length > 0) {
        setSelectedUser(response.data[0]);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadConversation = async () => {
    if (!currentUser || !selectedUser) return;
    
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/messages/conversation?userId1=${currentUser.id}&userId2=${selectedUser.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/messages/send`,
        {
          senderId: currentUser.id,
          receiverId: selectedUser.id,
          content: text
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setText("");
      loadConversation();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid" style={{ height: "calc(100vh - 56px)", overflow: "hidden" }}>
        <div className="row h-100 g-0">
          {/* Left Panel - Info Section */}
          <div className="col-lg-4 border-end" style={{ height: "100%", overflowY: "auto", background: "#f8f9fa" }}>
            <div className="p-4">
              {/* Adoption Info Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-body text-center">
                  <div style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    margin: "0 auto 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <i className="fas fa-heart" style={{ fontSize: "60px", color: "white" }}></i>
                  </div>
                  <h5 className="fw-bold mb-3">Adoption Support Chat</h5>
                  <p className="text-muted small mb-3">
                    Connect with our staff for any questions about the adoption process. 
                    We're here to help you every step of the way.
                  </p>
                  <div className="d-flex justify-content-around mt-4">
                    <div className="text-center">
                      <i className="fas fa-clock text-primary" style={{ fontSize: "24px" }}></i>
                      <p className="small mt-2 mb-0">24/7 Support</p>
                    </div>
                    <div className="text-center">
                      <i className="fas fa-shield-alt text-success" style={{ fontSize: "24px" }}></i>
                      <p className="small mt-2 mb-0">Secure Chat</p>
                    </div>
                    <div className="text-center">
                      <i className="fas fa-bolt text-warning" style={{ fontSize: "24px" }}></i>
                      <p className="small mt-2 mb-0">Quick Reply</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h6 className="mb-0 fw-bold">
                    <i className="fas fa-lightbulb text-warning me-2"></i>
                    Quick Tips
                  </h6>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      <small>Be clear and specific in your questions</small>
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      <small>Include application ID if relevant</small>
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      <small>Messages are saved for your reference</small>
                    </li>
                    <li className="mb-0">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      <small>Response time: Usually within 24 hours</small>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact List */}
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h6 className="mb-0 fw-bold">
                    <i className="fas fa-users me-2"></i>
                    {currentUser?.role === 'PARENT' ? 'Staff Members' : 'Parents'}
                  </h6>
                </div>
                <div className="list-group list-group-flush" style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {users.map(user => (
                    <button
                      key={user.id}
                      className={`list-group-item list-group-item-action ${selectedUser?.id === user.id ? 'active' : ''}`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="d-flex align-items-center">
                        <div style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: selectedUser?.id === user.id ? "white" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: selectedUser?.id === user.id ? "#667eea" : "white",
                          fontWeight: "bold",
                          marginRight: "12px"
                        }}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-bold">{user.username}</div>
                          <small className={selectedUser?.id === user.id ? "text-white-50" : "text-muted"}>
                            {user.role}
                          </small>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {users.length === 0 && (
                  <div className="card-body text-center text-muted">
                    <i className="fas fa-info-circle me-2"></i>
                    No contacts available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Chat Section */}
          <div className="col-lg-8" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Chat Header */}
            <div className="p-3 border-bottom bg-white">
              {selectedUser ? (
                <div className="d-flex align-items-center">
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "20px",
                    marginRight: "15px"
                  }}>
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="mb-0">{selectedUser.username}</h5>
                    <small className="text-muted">{selectedUser.role}</small>
                  </div>
                </div>
              ) : (
                <h5 className="mb-0 text-muted">Select a contact to start chatting</h5>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-grow-1 p-4" style={{ overflowY: "auto", background: "#f8f9fa" }}>
              {selectedUser ? (
                messages.length > 0 ? (
                  <>
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`mb-3 d-flex ${m.sender.id === currentUser.id ? "justify-content-end" : "justify-content-start"}`}
                      >
                        <div style={{ maxWidth: "70%" }}>
                          <div
                            className="p-3 rounded-3 shadow-sm"
                            style={{
                              background: m.sender.id === currentUser.id 
                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                : "white",
                              color: m.sender.id === currentUser.id ? "white" : "black"
                            }}
                          >
                            <div className="d-flex align-items-center mb-2">
                              <div style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                background: m.sender.id === currentUser.id ? "rgba(255,255,255,0.3)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "12px",
                                marginRight: "8px"
                              }}>
                                {m.sender.username.charAt(0).toUpperCase()}
                              </div>
                              <small className="fw-bold">{m.sender.username}</small>
                            </div>
                            <p className="mb-1">{m.content}</p>
                            <small style={{ opacity: 0.7, fontSize: "0.75rem" }}>
                              {new Date(m.createdAt).toLocaleTimeString()}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="text-center text-muted" style={{ marginTop: "100px" }}>
                    <div style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      margin: "0 auto 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <i className="fas fa-comments" style={{ fontSize: "50px", color: "white" }}></i>
                    </div>
                    <h5>No messages yet</h5>
                    <p>Start the conversation by sending a message below</p>
                  </div>
                )
              ) : (
                <div className="text-center text-muted" style={{ marginTop: "100px" }}>
                  <div style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    margin: "0 auto 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <i className="fas fa-user-friends" style={{ fontSize: "50px", color: "white" }}></i>
                  </div>
                  <h5>Select a contact</h5>
                  <p>Choose someone from the list to start chatting</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-top bg-white">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={selectedUser ? "Type your message..." : "Select a contact first"}
                  disabled={!selectedUser}
                />
                <button
                  className="btn btn-lg px-4"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none"
                  }}
                  onClick={sendMessage}
                  disabled={!selectedUser || !text.trim()}
                >
                  <i className="fas fa-paper-plane me-2"></i>Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
