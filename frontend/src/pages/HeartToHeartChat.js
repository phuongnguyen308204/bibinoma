import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatMessages from '../components/Chat/ChatMessages';
import ChatInput from '../components/Chat/ChatInput';
import { useLanguage } from '../contexts/LanguageContext';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import MemoriesModal from '../components/Modal/MemoriesModal';
import chatService from '../services/chatService';

export default function HeartToHeartChat() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { switchChatType, loadConversationHistory } = useChat();
  const { user } = useAuth();
  const [memoriesOpen, setMemoriesOpen] = useState(false);
  const [memoriesList, setMemoriesList] = useState([]);

  const openMemories = async () => {
    setMemoriesOpen(true);
    const data = await chatService.getMemories('heart_to_heart');
    setMemoriesList(data);
  };

  const refreshMemories = useCallback(async () => {
    try {
      const data = await chatService.getMemories('heart_to_heart');
      setMemoriesList(data);
    } catch (error) {
      console.error('Error refreshing memories:', error);
      setMemoriesList([]);
    }
  }, []);

  useEffect(() => {
    switchChatType('heart_to_heart');
  }, []); 

  return (
    <div className="flex h-screen w-full bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex-col">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-40 flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img src={process.env.PUBLIC_URL + '/images/bibi.png'} alt="Bibi" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('chat.heartToHeart')}
              </h1>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-700/50">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="text-sm font-semibold">
                {new Intl.NumberFormat('vi-VN').format(user?.money || 0)}₫
              </span>
            </div>
            <button
              onClick={openMemories}
              className="px-3 py-1.5 bg-pink-100 text-pink-700 text-sm rounded-md hover:bg-pink-200 dark:bg-pink-900/20 dark:text-pink-200 dark:hover:bg-pink-900/30 transition-colors"
            >
              Trí nhớ của Bibi
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <ChatMessages />
          <div className="sticky bottom-0 z-40 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <ChatInput />
          </div>
        </div>

        <MemoriesModal
          open={memoriesOpen}
          onClose={() => setMemoriesOpen(false)}
          chatType="heart_to_heart"
          memories={memoriesList}
          onRefresh={refreshMemories}
        />
      </div>
    </div>
  );
}
