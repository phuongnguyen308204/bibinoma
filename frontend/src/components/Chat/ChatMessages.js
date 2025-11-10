import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ChatMessages() {
  const { messages, isLoading, currentChatType } = useChat();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const renderMessage = (text) => {
    if (!text) return text;

    const normalize = (s) => (s || '').replace(/[ \t]+/g, ' ').trim();

    if (text.includes('[💬 Tâm sự với Bibi](/chat/heart-to-heart)')) {
      const parts = text.split('[💬 Tâm sự với Bibi](/chat/heart-to-heart)');
      return (
        <>
          {normalize(parts[0])}
          <br />
          <button
            onClick={() => window.location.href = '/chat/heart-to-heart'}
            className="inline-block mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors"
          >
            💬 Tâm sự với Bibi
          </button>
          {normalize(parts[1]) && <br />}
          {normalize(parts[1])}
        </>
      );
    }

    if (
      currentChatType === 'heart_to_heart' &&
      text.includes('[📋 Lên kế hoạch với Noma](/chat/planning)')
    ) {
      const parts = text.split('[📋 Lên kế hoạch với Noma](/chat/planning)');
      return <>{normalize(parts[0] + parts[1])}</>;
    }
    return normalize(text);
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 space-y-3 sm:space-y-4 overflow-y-auto p-2 sm:p-4 custom-scrollbar">
      {Object.entries(groupedMessages).map(([date, dayMessages]) => (
        <div key={date} className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
              {formatDate(date)}
            </div>
          </div>
          
          {dayMessages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-1 sm:mb-2`}>
              <div className={`max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : m.role === 'system'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
              }`}>
                <div className="whitespace-pre-line break-words leading-relaxed">{renderMessage(m.text)}</div>
                {m.timestamp && (
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              <span>{currentChatType === 'heart_to_heart' ? t('chat.thinking.bibi') : t('chat.thinking.noma')}</span>
            </div>
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}


