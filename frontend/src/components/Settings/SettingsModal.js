import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { useModal } from '../../contexts/ModalContext';
import chatService from '../../services/chatService';

export default function SettingsModal({ open, onClose }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { logoutAll } = useAuth();
  const { clearAllMessages } = useChat();
  const { openModal, closeModal } = useModal();
  const [deleteType, setDeleteType] = useState(null);

  const handleDeleteData = (type) => {
    setDeleteType(type);
    onClose();
    openModal({
      type: 'deleteConfirm',
      deleteType: type
    });
  };

  const confirmDeleteData = async (type) => {
    try {
      if (type === 'bibi') {
        await chatService.deleteBibiData();
        localStorage.removeItem('heart_to_heart_messages');
        localStorage.removeItem('heart_to_heart_history');
      } else if (type === 'noma') {
        await chatService.deleteNomaData();
        localStorage.removeItem('planning_messages');
        localStorage.removeItem('planning_history');
      } else {
        await chatService.deleteChatData();
        clearAllMessages();
        localStorage.removeItem('chatMessages');
        localStorage.removeItem('conversationHistory');
      }
      
      closeModal();
      setTimeout(() => {
        openModal({
          type: 'success',
          message: t('settings.deleteSuccess')
        });
      }, 200);
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Có lỗi xảy ra khi xóa dữ liệu. Vui lòng thử lại.');
      closeModal();
    }
  };

  const cancelDeleteData = () => {
    closeModal();
  };

  const handleSuccessOK = () => {
    closeModal();
    window.location.href = '/';
  };

  return (
    <Modal open={open} onClose={onClose} title={t('settings.title')}>
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            {t('settings.generalTitle')}
          </h3>
          
          <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/60 px-4 py-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{t('settings.theme')}</span>
            </div>
            <button 
              onClick={toggleTheme} 
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium text-sm shadow-sm hover:shadow-md transform hover:scale-105"
            >
              {theme === 'dark' ? 'Tối' : 'Sáng'}
            </button>
          </div>
          
          <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/60 px-4 py-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{t('settings.language')}</span>
            </div>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)} 
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/60 px-4 py-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{t('auth.logoutAll')}</span>
            </div>
            <button 
              onClick={async () => {
                await logoutAll();
                onClose();
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium text-sm shadow-sm hover:shadow-md transform hover:scale-105"
            >
              {t('auth.logoutAll')}
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t('settings.deleteSectionTitle')}
          </h3>
          
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-4 border border-red-200 dark:border-red-800">
              <div className="mb-3 sm:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-pink-100 dark:bg-pink-900/50">
                    <img src={process.env.PUBLIC_URL + '/images/bibi.png'} alt="Bibi" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-red-800 dark:text-red-200 font-semibold">{t('settings.deleteBibiTitle')}</span>
                </div>
                <p className="text-xs text-red-600 dark:text-red-300">{t('settings.deleteBibiDesc')}</p>
              </div>
              <button 
                onClick={() => handleDeleteData('bibi')}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium text-sm shadow-sm hover:shadow-md transform hover:scale-105"
              >
                {t('settings.deleteAllBtn')}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-4 border border-red-200 dark:border-red-800">
              <div className="mb-3 sm:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/50">
                    <img src={process.env.PUBLIC_URL + '/images/noma.png'} alt="Noma" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-red-800 dark:text-red-200 font-semibold">{t('settings.deleteNomaTitle')}</span>
                </div>
                <p className="text-xs text-red-600 dark:text-red-300">{t('settings.deleteNomaDesc')}</p>
              </div>
              <button 
                onClick={() => handleDeleteData('noma')}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium text-sm shadow-sm hover:shadow-md transform hover:scale-105"
              >
                {t('settings.deleteAllBtn')}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl bg-red-100 dark:bg-red-900/30 px-4 py-4 border-2 border-red-300 dark:border-red-700">
              <div className="mb-3 sm:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-red-800 dark:text-red-200 font-bold">{t('settings.deleteAllTitle')}</span>
                </div>
                <p className="text-xs text-red-700 dark:text-red-300 font-medium">{t('settings.deleteAllDesc')}</p>
              </div>
              <button 
                onClick={() => handleDeleteData('all')}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg hover:from-red-800 hover:to-red-900 transition-all font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 border border-red-600"
              >
                {t('settings.deleteAllBtn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}


