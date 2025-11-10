import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatMessages from '../components/Chat/ChatMessages';
import ChatInput from '../components/Chat/ChatInput';
import { useLanguage } from '../contexts/LanguageContext';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import MemoriesModal from '../components/Modal/MemoriesModal';
import chatService from '../services/chatService';

export default function PlanningChat() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { switchChatType, loadConversationHistory } = useChat();
  const { user } = useAuth();
  const [memoriesOpen, setMemoriesOpen] = useState(false);
  const [memoriesList, setMemoriesList] = useState([]);
  const [memoriesType, setMemoriesType] = useState('all');
  const hasInitialized = useRef(false);

  const openPlans = async () => {
    try {
      const data = await chatService.getMemories('planning');
      setMemoriesList(data);
      setMemoriesType('plans');
      setMemoriesOpen(true);
    } catch (error) {
      console.error('Error loading plans:', error);
      setMemoriesList([]);
      setMemoriesType('plans');
      setMemoriesOpen(true);
    }
  };

  const openHabits = async () => {
    try {
      const data = await chatService.getMemories('planning');
      setMemoriesList(data);
      setMemoriesType('habits');
      setMemoriesOpen(true);
    } catch (error) {
      console.error('Error loading habits:', error);
      setMemoriesList([]);
      setMemoriesType('habits');
      setMemoriesOpen(true);
    }
  };

  const refreshMemories = useCallback(async () => {
    try {
      const data = await chatService.getMemories('planning');
      setMemoriesList(data);
    } catch (error) {
      console.error('Error refreshing memories:', error);
      setMemoriesList([]);
    }
  }, []);

  useEffect(() => {
    switchChatType('planning');
  }, []); 

  return (
    <div className="flex h-screen w-full bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex-col">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-40 flex items-center gap-2 sm:gap-4 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img src={process.env.PUBLIC_URL + '/images/noma.png'} alt="Noma" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {t('chat.planning')}
              </h1>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-700/50">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="text-sm font-semibold">
                {new Intl.NumberFormat('vi-VN').format(user?.money || 0)}₫
              </span>
            </div>
            
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={openPlans}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-indigo-100 text-indigo-700 text-xs sm:text-sm rounded-md hover:bg-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-200 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <span className="hidden sm:inline">Kế hoạch hằng ngày</span>
                <span className="sm:hidden">Kế hoạch</span>
              </button>
              <button
                onClick={openHabits}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-100 text-purple-700 text-xs sm:text-sm rounded-md hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-200 dark:hover:bg-purple-900/30 transition-colors"
              >
                <span className="hidden sm:inline">Thói quen và sở thích</span>
                <span className="sm:hidden">Thói quen</span>
              </button>
            </div>
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
          chatType="planning"
          memories={memoriesList}
          memoriesType={memoriesType}
          onRefresh={refreshMemories}
        />
      </div>
    </div>
  );
}
