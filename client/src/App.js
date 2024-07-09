import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

function App() {

  const [socketId, setSocketId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {

    socket.on('connect', () => {
      setSocketId(socket.id);
    })

    socket.on('received_message', handleReceivedMessage);

    return () => {
      // clear the received_message event
      socket.off('received_message');
    }

  }, []);

  const handleReceivedMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message])
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if(input) {
      socket.emit('chat_message', input);
      setInput('');
    }
  }

  return (
    <div className="chat-container">
      <h3>
          <span>Socket ID: </span>
          <span className="socket-id">{socketId}</span>
      </h3>

      <ul className="chat-messages">
          {messages.map((message, index) => (
              <li key={index}>
                  <span className="message-sender">{message.id}: </span>
                  <span className="message-text">{message.message}</span>
              </li>
          ))}
      </ul>

      <form className="chat-form" onSubmit={handleSubmit}>
          <input type="text" value={input} onChange={handleInputChange} />
          <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
