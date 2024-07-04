import React, { useLayoutEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import lotusSvg from '../../assets/lotus.svg';
import { API_URL } from '../../variables/config';
import './chatbotpage.css';

interface Message {
  text: string;
  sender: 'user' | 'bot' | 'error';
}

const ChatBotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div
          className="welcome-message"
          style={{
            height: '500px',
            backgroundImage: `url(${lotusSvg})`,
            justifyContent: 'center',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.5
          }}
        >
          <h2>Chat with Our PeaceBot</h2>
          <p>We're here to support you on your journey to mental well-being.</p>
          <p>Feel free to share how you're feeling, or ask any questions you might have.</p>
          <p><b style={{color:'blue'}}> DISCLAIMER!</b> PeaceBot doesnt not replace a licenced therapist!</p>
          <p>
            If you're in a moment of crisis, please visit our{' '}
            <a href="/gethelp" style={{ color: '#515665', fontWeight: 'bold' }}>
              resources and support
            </a>{' '}
            page immediately!
          </p>
        </div>
      );
    }

    return (
      <>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="loading">PeaceBot is thinking...</div>}
      </>
    );
  };

  useLayoutEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (): Promise<void> => {
    if (input.trim()) {
      const newUserMessage: Message = { text: input, sender: 'user' };
      setMessages((messages) => [...messages, newUserMessage]);
      setInput('');
      setLoading(true);

      try {
        const response = await mockApiCall(input);
        setLoading(false);
        typeMessage(response, 'bot');
      } catch (error) {
        setLoading(false);
        setMessages((messages) => [...messages, { text: 'Something went wrong, try again!', sender: 'error' }]);
      }
    }
  };

  const typeMessage = (message: string, sender: 'user' | 'bot' | 'error') => {
    let typedMessage = '';
    if (typingTimeoutRef.current) {
      clearInterval(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setInterval(() => {
      if (typedMessage.length < message.length) {
        typedMessage += message[typedMessage.length];
        setMessages((messages) => {
          const newMessages = [...messages];
          if (sender === 'bot' && messages[messages.length - 1]?.sender === 'bot') {
            newMessages[messages.length - 1] = { text: typedMessage, sender };
          } else {
            newMessages.push({ text: typedMessage, sender });
          }
          return newMessages;
        });
      } else {
        clearInterval(typingTimeoutRef.current!);
      }
    }, 50); 
  };

  const mockApiCall = async (input: string): Promise<string> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.response;
  };

  return (
    <div>
      <div className="chat-window-container">
        <div
          className="chat-window"
          style={{
            height: '500px',
            backgroundImage: `url(${lotusSvg})`,
            justifyContent: 'center',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          ref={chatWindowRef}
        >
          {renderMessages()} {}
        </div>
        <div className="input-wrapper">
          <input
            className="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button className="send-button" onClick={sendMessage}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotPage;
