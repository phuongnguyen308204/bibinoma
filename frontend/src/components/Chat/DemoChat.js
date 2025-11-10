import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function DemoChat({ character, chatType }) {
  const { t } = useLanguage();
  const messagesEndRef = useRef(null);


  const getDemoMessages = () => {
    const now = new Date();
    const getTimestamp = (minutesAgo) => {
      const time = new Date(now.getTime() - minutesAgo * 60000);
      return time.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      });
    };

    if (chatType === 'planning') {
      return [
        {
          id: 1,
          type: 'bot',
          content: t('chat.demo.planning.bot.greeting'),
          timestamp: getTimestamp(8)
        },
        {
          id: 2,
          type: 'user',
          content: t('chat.demo.planning.user.question'),
          timestamp: getTimestamp(7)
        },
        {
          id: 3,
          type: 'bot',
          content: t('chat.demo.planning.bot.response'),
          timestamp: getTimestamp(5)
        },
        {
          id: 4,
          type: 'user',
          content: t('chat.demo.planning.user.followUp'),
          timestamp: getTimestamp(3)
        },
        {
          id: 5,
          type: 'bot',
          content: t('chat.demo.planning.bot.detailedResponse'),
          timestamp: getTimestamp(1)
        },
        {
          id: 6,
          type: 'user',
          content: t('chat.demo.planning.user.agreement'),
          timestamp: getTimestamp(0)
        }
      ];
    } else {
      return [
        {
          id: 1,
          type: 'bot',
          content: t('chat.demo.heartToHeart.bot.greeting'),
          timestamp: getTimestamp(8)
        },
        {
          id: 2,
          type: 'user',
          content: t('chat.demo.heartToHeart.user.question'),
          timestamp: getTimestamp(7)
        },
        {
          id: 3,
          type: 'bot',
          content: t('chat.demo.heartToHeart.bot.response'),
          timestamp: getTimestamp(6)
        },
        {
          id: 4,
          type: 'user',
          content: t('chat.demo.heartToHeart.user.share'),
          timestamp: getTimestamp(4)
        },
        {
          id: 5,
          type: 'bot',
          content: t('chat.demo.heartToHeart.bot.comfort'),
          timestamp: getTimestamp(2)
        },
        {
          id: 6,
          type: 'user',
          content: t('chat.demo.heartToHeart.user.thanks'),
          timestamp: getTimestamp(1)
        },
        {
          id: 7,
          type: 'bot',
          content: t('chat.demo.heartToHeart.bot.support')
        }
      ];
    }
  };

  const messages = getDemoMessages();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 overflow-hidden rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600">
            <img 
              src={process.env.PUBLIC_URL + `/images/${character.toLowerCase()}.png`} 
              alt={character} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white truncate">
              {character}
            </h1>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Đang hoạt động</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3 relative min-h-[200px] max-h-[280px] sm:max-h-[350px] lg:max-h-[450px] bg-gray-50/30 dark:bg-gray-800/30 custom-scrollbar">
        <div className="flex justify-center mb-3 sm:mb-4 sticky top-0 z-10">
          <div className="px-3 py-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
            Hôm nay
          </div>
        </div>
        
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-2 sm:mb-3 ${
              index >= 4 ? 'opacity-0 animate-fade-in' : ''
            }`}
            style={{
              animationDelay: `${index * 0.3}s`,
              animationFillMode: 'forwards'
            }}
          >
            {message.type === 'bot' && (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 mr-2 sm:mr-3 mt-1">
                <img 
                  src={process.env.PUBLIC_URL + `/images/${character.toLowerCase()}.png`} 
                  alt={character} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <div
              className={`max-w-[75%] sm:max-w-[80%] lg:max-w-lg px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl transition-all duration-300 shadow-sm ${
                message.type === 'user'
                  ? chatType === 'planning' 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-md'
                    : 'bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-br-md'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md'
              }`}
            >
              <p className="text-xs sm:text-sm lg:text-base leading-relaxed whitespace-pre-line">{(message.content || '').replace(/[ \t]+/g, ' ').trim()}</p>
              <div className={`text-xs mt-1.5 flex items-center gap-1 ${
                message.type === 'user' 
                  ? 'text-white/70 justify-end' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                <span>{message.timestamp}</span>
                {message.type === 'user' && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            {message.type === 'user' && (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900 flex-shrink-0 ml-2 sm:ml-3 mt-1">
                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                  U
                </div>
              </div>
            )}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 sm:p-3 lg:p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-xs sm:text-sm transition-all"
              disabled
            />
          </div>
          <button
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-white font-medium transition-all text-xs sm:text-sm shadow-sm hover:shadow-md transform hover:scale-105 flex-shrink-0 ${
              chatType === 'planning' 
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800' 
                : 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800'
            }`}
            disabled
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
