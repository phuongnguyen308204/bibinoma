import React, { useState, useEffect } from 'react';
import { useModal } from '../../contexts/ModalContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useChat } from '../../contexts/ChatContext';
import chatService from '../../services/chatService';

export default function ModalManager() {
  const { currentModal, closeModal, openModal } = useModal();
  const { t } = useLanguage();
  const { clearAllMessages } = useChat();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeoutId;
    
    if (currentModal) {
      setShouldRender(true);
      timeoutId = setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      timeoutId = setTimeout(() => setShouldRender(false), 200);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentModal]);

  if (!currentModal || !currentModal.type) {
    return null;
  }

  if (!shouldRender) return null;

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

  const handleSuccessOK = () => {
    closeModal();
    window.location.href = '/';
  };

  if (currentModal && currentModal.type === 'deleteConfirm') {
    const { deleteType } = currentModal;
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl transition-all duration-200 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {deleteType === 'bibi' ? t('settings.deleteDataBibi') : 
             deleteType === 'noma' ? t('settings.deleteDataNoma') : 
             t('settings.deleteData')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {deleteType === 'bibi' ? t('settings.deleteDataBibiConfirm') : 
             deleteType === 'noma' ? t('settings.deleteDataNomaConfirm') : 
             t('settings.deleteDataConfirm')}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mb-6">
            {t('settings.deleteDataWarning')}
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              {t('settings.cancel')}
            </button>
            <button
              onClick={() => confirmDeleteData(deleteType)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              {t('settings.confirm')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentModal && currentModal.type === 'success') {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl transition-all duration-200 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Thành công!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {currentModal.message || t('settings.deleteSuccess')}
            </p>
            <button
              onClick={handleSuccessOK}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
