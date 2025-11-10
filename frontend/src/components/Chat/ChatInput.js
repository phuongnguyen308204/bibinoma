import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../Modal/LoginModal';

export default function ChatInput() {
  const { t } = useLanguage();
  const { sendMessage, isLoading } = useChat();
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const textRef = useRef(null);

  function autoResize() {
    const el = textRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight || '20', 10);
    const maxHeight = lineHeight * 5 + 12; 
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = newHeight + 'px';
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  useEffect(() => {
    autoResize();
  }, [text]);

  function handleSubmit(e) {
    e.preventDefault();
    const msg = text.trim();
    if (!msg || isLoading) return;
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    sendMessage(msg);
    setText('');
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex items-end gap-2 sm:gap-3 border-t border-gray-200 bg-white p-2 sm:p-3 dark:border-gray-800 dark:bg-gray-900">
        <textarea
          ref={textRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          placeholder={t('chat.placeholder')}
          className="max-h-32 sm:max-h-40 min-h-[40px] sm:min-h-[44px] w-full resize-none overflow-y-hidden rounded-lg sm:rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder-gray-500 focus:border-indigo-500 focus:ring-0 dark:border-gray-800 dark:bg-gray-950"
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="shrink-0 rounded-lg sm:rounded-md bg-indigo-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('chat.sending') || 'Sending...' : t('chat.send')}
        </button>
      </form>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}


