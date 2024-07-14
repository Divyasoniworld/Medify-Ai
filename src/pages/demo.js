import React, { useState, useEffect } from 'react';

const demo = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = { role: 'user', message: input };
    setMessages([...messages, newMessage]);

    const response = await fetch('/api/hello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcript: input }),
    });

    if (response.ok) {
      const eventSource = new EventSource('/api/hello');
      eventSource.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, parsedData]);
      };
      
      eventSource.onerror = () => {
        eventSource.close();
      };
    }

    setInput('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === 'user' ? 'user-message' : 'ai-message'}>
            {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default demo;
