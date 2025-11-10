import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import chatService from '../services/chatService';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};


export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentChatType, setCurrentChatType] = useState('planning');
  const { t } = useLanguage();
  const { refreshAuth } = useAuth();


  const getUserId = () => {
    return localStorage.getItem('userId') || 'user_' + Date.now();
  };


  const sendMessage = useCallback(async (text) => {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: text,
      timestamp: new Date().toISOString()
    };

    const chatHistory = messages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.text,
      timestamp: msg.timestamp
    }));

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const memories = await chatService.getMemories(currentChatType);
      
      const dbChatHistory = await chatService.getChatHistory(currentChatType);
      let formattedChatHistory = [];
      
      if (dbChatHistory && dbChatHistory.messages && dbChatHistory.messages.length > 0) {
        const recentMessages = dbChatHistory.messages.slice(-10);
        formattedChatHistory = recentMessages.flatMap(record => [
          {
            role: 'user',
            content: record.user,
            timestamp: record.created_at
          },
          {
            role: 'assistant', 
            content: record.noma,
            timestamp: record.created_at
          }
        ]);
      }
      
      const response = await chatService.sendMessage(text, memories, currentChatType, formattedChatHistory);
      try { await refreshAuth(true); } catch (_) {}
      
      if (!response || !response.noma) {
        throw new Error('Invalid response format from server');
      }
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: response.noma,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (err) {
      console.error('Error sending message:', err);
      const isPaymentRequired = /402/.test(err.message) || /Payment Required/i.test(err.message) || /insufficient_funds/i.test(err.message);
      if (isPaymentRequired) {
        const errorMessage = {
          id: Date.now() + 1,
          role: 'system',
          text: t('chat.needTopUp'),
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        setError(err.message || 'Failed to send message');
        const errorMessage = {
          id: Date.now() + 1,
          role: 'system',
          text: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentChatType]);


  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const loadConversationHistory = useCallback(async () => {
    try {
      const history = await chatService.getChatHistory(currentChatType);
      
      if (history && history.messages && history.messages.length > 0) {
        const formattedMessages = [];
        history.messages.forEach((record, index) => {
          if (record.user && record.user.trim() !== '' && record.user.trim() !== ' ') {
            formattedMessages.push({
              id: record.id * 2 - 1,
              role: 'user',
              text: record.user,
              timestamp: record.created_at
            });
          }
          if (record.noma && record.noma.trim() !== '') {
            formattedMessages.push({
              id: record.id * 2,
              role: 'assistant',
              text: record.noma,
              timestamp: record.created_at
            });
          }
        });
        
        const lastTimestamp = formattedMessages[formattedMessages.length - 1]?.timestamp;
        if (lastTimestamp) {
          const lastDate = new Date(lastTimestamp);
          const today = new Date();
          if (lastDate.toDateString() !== today.toDateString()) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            let lastDayLabel = '';
            if (lastDate.toDateString() === yesterday.toDateString()) {
              lastDayLabel = 'hôm qua';
            } else {
              lastDayLabel = lastDate.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            }

            let promptText = '';
            try {
              const res = await chatService.saveNewDayPrompt('', currentChatType);
              if (res && res.text) {
                promptText = res.text;
              }
            } catch (_) {}
            
            if (!promptText) {
              promptText = 'Đang tải...';
            }

            formattedMessages.push({
              id: Date.now(),
              role: 'assistant',
              text: promptText,
              timestamp: new Date().toISOString()
            });
          }
        }

        setMessages(formattedMessages);
      } else {
        let greetingText = '';
        try {
          const res = await chatService.saveNewDayPrompt('', currentChatType);
          if (res && res.text) {
            greetingText = res.text;
          }
        } catch (_) {}
        
        if (!greetingText) {
          greetingText = 'Đang tải...';
        }
        
        const welcomeMessage = {
          id: 0,
          role: 'assistant',
          text: greetingText,
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      }
    } catch (err) {
      console.error('Error loading conversation history:', err);
      let greetingText = '';
      try {
        const res = await chatService.saveNewDayPrompt('', currentChatType);
        if (res && res.text) {
          greetingText = res.text;
        }
      } catch (_) {}
      
      if (!greetingText) {
        greetingText = 'Đang tải...';
      }
      
      const welcomeMessage = {
        id: 0,
        role: 'assistant',
        text: greetingText,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, [t]); 

  const switchChatType = useCallback(async (chatType) => {
    setCurrentChatType(chatType);
    setMessages([]);
    setError(null);
    
    try {
      const history = await chatService.getChatHistory(chatType);
      
      if (history && history.messages && history.messages.length > 0) {
        const formattedMessages = [];
        history.messages.forEach((record, index) => {
          if (record.user && record.user.trim() !== '' && record.user.trim() !== ' ') {
            formattedMessages.push({
              id: record.id * 2 - 1,
              role: 'user',
              text: record.user,
              timestamp: record.created_at
            });
          }
          if (record.noma && record.noma.trim() !== '') {
            formattedMessages.push({
              id: record.id * 2,
              role: 'assistant',
              text: record.noma,
              timestamp: record.created_at
            });
          }
        });
        
        const lastTimestamp = formattedMessages[formattedMessages.length - 1]?.timestamp;
        if (lastTimestamp) {
          const lastDate = new Date(lastTimestamp);
          const today = new Date();
          if (lastDate.toDateString() !== today.toDateString()) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            let lastDayLabel = '';
            if (lastDate.toDateString() === yesterday.toDateString()) {
              lastDayLabel = 'hôm qua';
            } else {
              lastDayLabel = lastDate.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            }

            let promptText = '';
            try {
              const res = await chatService.saveNewDayPrompt('', chatType);
              if (res && res.text) {
                promptText = res.text;
              }
            } catch (_) {}
            
            if (!promptText) {
              promptText = 'Đang tải...';
            }

            formattedMessages.push({
              id: Date.now(),
              role: 'assistant',
              text: promptText,
              timestamp: new Date().toISOString()
            });
          }
        }

        setMessages(formattedMessages);
      } else {
        let greetingText = '';
        try {
          const res = await chatService.saveNewDayPrompt('', chatType);
          if (res && res.text) {
            greetingText = res.text;
          }
        } catch (_) {}
        
        if (!greetingText) {
          greetingText = 'Đang tải...';
        }
        
        const welcomeMessage = {
          id: 0,
          role: 'assistant',
          text: greetingText,
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      }
    } catch (err) {
      console.error('Error loading conversation history:', err);
      let greetingText = '';
      try {
        const res = await chatService.saveNewDayPrompt('', chatType);
        if (res && res.text) {
          greetingText = res.text;
        }
      } catch (_) {}
      
      if (!greetingText) {
        greetingText = 'Đang tải...';
      }
      
      const welcomeMessage = {
        id: 0,
        role: 'assistant',
        text: greetingText,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, [t]);

  const clearAllMessages = useCallback(async () => {
    try {
      await chatService.deleteChatData();
      setMessages([]);
      setError(null);
    } catch (err) {
      console.error('Error clearing messages:', err);
    }
  }, []);

  const value = {
    messages,
    isLoading,
    error,
    currentChatType,
    sendMessage,
    clearMessages,
    clearAllMessages,
    loadConversationHistory,
    switchChatType
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};