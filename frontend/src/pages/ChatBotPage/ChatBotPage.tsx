import React, { useLayoutEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import lotusSvg from '../../lotus.svg';
import './chatbotpage.css';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatBotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const chatWindowRef = useRef<HTMLDivElement>(null);
  
  // Ref to keep track of the current bot typing timeout/interval
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="welcome-message" style={{ height: '500px',
            backgroundImage: `url(${lotusSvg})`,justifyContent: 'center',  
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat',opacity: 0.5 }}>
          <h2 >Chat with Our PeaceBot</h2>
          <p>We're here to support you on your journey to mental well-being.</p>
          <p>Feel free to share how you're feeling, or ask any questions you might have.</p>
          <p>If you're in a moment of crisis, please visit our <a href="/gethelp" style={{ color: '#515665', fontWeight: 'bold' }}>resources and support</a> page immediately! </p>
        </div>
      );
    }

    // Messages exist, render them
    return messages.map((msg, index) => (
      <div key={index} className={`message ${msg.sender}`}>
        {msg.text}
      </div>
    ));
  };

  useLayoutEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]); 

  const sendMessage = async (): Promise<void> => {
    if (input.trim()) {
        const newUserMessage: Message = { text: input, sender: 'user' };
        setMessages(messages => [...messages, newUserMessage]);
        setInput('');

        const response = await mockApiCall(input);
        typeMessage(response, 'bot');
    }
  };

  const typeMessage = (message: string, sender: 'user' | 'bot') => {
    let typedMessage = '';
    // Clear any existing typing animation
    if (typingTimeoutRef.current) {
      clearInterval(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setInterval(() => {
      if (typedMessage.length < message.length) {
        typedMessage += message[typedMessage.length];
        setMessages(messages => {
          // Replace the last message if it's from the bot and incomplete
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
    }, 50); // Typing speed in milliseconds
  };

  const mockApiCall = (input: string): Promise<string> => {
    // Simulate a response from a server
    return new Promise(resolve => {
      setTimeout(() => resolve(`Echoing back: ${input}`), 500);
    });
  };

  return (
    <div>
      
      <div className='chat-window-container'>
      <div className="chat-window" style={{ height: '500px',
            backgroundImage: `url(${lotusSvg})`,justifyContent: 'center',  
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat'}}ref={chatWindowRef}>
          {renderMessages()} {/* Use the renderMessages function */}
        </div>
        <div className="input-wrapper">
          <input
            className='chat-input'
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
