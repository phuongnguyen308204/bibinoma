import React, { useState, useEffect } from 'react';
import chatService from '../../services/chatService';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MemoriesModal({ open, onClose, chatType = 'planning', memories = [], memoriesType = 'all', onRefresh }) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [deletingHabit, setDeletingHabit] = useState(null);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 200);
    }
  }, [open]);

  const handleDeleteHabit = async (weekday, habitIndex) => {
    try {
      setDeletingHabit(`${weekday}-${habitIndex}`);
      await chatService.deleteHabit(weekday, habitIndex);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Có lỗi xảy ra khi xóa thói quen. Vui lòng thử lại.');
    } finally {
      setDeletingHabit(null);
    }
  };

  if (!shouldRender) return null;

  const parseMemory = (item) => {
    if (chatType === 'heart_to_heart') {
      try {
        const obj = JSON.parse(item);
        console.log('parseMemory - parsed obj:', obj);
        let dateStr = '';
        if (obj.timestamp) {
          const date = new Date(obj.timestamp);
          dateStr = date.toLocaleDateString('vi-VN');
        }
        const result = { text: obj.memory || item, ts: dateStr };
        return result;
      } catch (e) {
        return { text: item, ts: '' };
      }
    }
    
    if (item.includes('name:')) {
      return null; 
    }
    
    const colonIndex = item.indexOf(':');
    if (colonIndex > 0) {
      const key = item.substring(0, colonIndex);
      const value = item.substring(colonIndex + 1);
      return { text: `${key}: ${value}`, ts: '' };
    }
    
    return { text: item, ts: '' };
  };

  const groupMemories = (memories) => {
    if (chatType === 'planning') {
      const plansDataItems = [];
      const seenDates = new Set(); 
      
      memories.forEach(item => {
        if ((memoriesType === 'plans' || memoriesType === 'all') && item.includes('plans_data:')) {
          const parts = item.split('plans_data:');
          if (parts.length > 1) {
            try {
              const plansData = JSON.parse(parts[1]);
              if (Array.isArray(plansData)) {
                plansData.forEach(dayData => {
                  if (dayData.plans && dayData.plans.length > 0 && dayData.date) {
                    const date = new Date(dayData.date);
                    const dateStr = date.toLocaleDateString('vi-VN');
                    const dateKey = `plans_${dateStr}`;
                    
                    if (!seenDates.has(dateKey)) {
                      seenDates.add(dateKey);
                      plansDataItems.push({
                        text: `Kế hoạch ngày ${dateStr}`,
                        plans: dayData.plans,
                        isCombined: true
                      });
                    }
                  }
                });
              } else if (plansData.plans && plansData.plans.length > 0 && plansData.timestamp) {
                const date = new Date(plansData.timestamp);
                const dateStr = date.toLocaleDateString('vi-VN');
                const dateKey = `plans_${dateStr}`;
                
                if (!seenDates.has(dateKey)) {
                  seenDates.add(dateKey);
                  plansDataItems.push({
                    text: `Kế hoạch ngày ${dateStr}`,
                    plans: plansData.plans,
                    isCombined: true
                  });
                }
              }
            } catch (e) {
            }
          }
        }
        
        if ((memoriesType === 'habits' || memoriesType === 'all') && item.includes('habits:')) {
          const parts = item.split('habits:');
          if (parts.length > 1) {
            try {
              const habitsData = JSON.parse(parts[1]);
              if (Array.isArray(habitsData)) {
                if (habitsData.length > 0 && typeof habitsData[0] === 'string') {
                  const flatKey = 'habits_flat';
                  if (!seenDates.has(flatKey)) {
                    seenDates.add(flatKey);
                    plansDataItems.push({
                      text: 'Thói quen và sở thích',
                      plans: habitsData,
                      isHabit: true,
                      isCombined: true
                    });
                  }
                } else {
                  habitsData.forEach(dayData => {
                    if (dayData.habits && dayData.habits.length > 0) {
                      const key = `habits_${dayData.weekday || 'all'}`;
                      if (!seenDates.has(key)) {
                        seenDates.add(key);
                        plansDataItems.push({
                          text: dayData.weekday ? `Thói quen ${dayData.weekday}` : 'Thói quen và sở thích',
                          plans: dayData.habits,
                          weekday: dayData.weekday,
                          isHabit: true,
                          isCombined: true
                        });
                      }
                    }
                  });
                }
              }
            } catch (e) {
            }
          }
        }
      });
      
      return plansDataItems;
    } else {
      return memories.map(item => parseMemory(item)).filter(item => item !== null);
    }
  };


  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`w-full max-w-lg mx-4 sm:mx-0 rounded-lg sm:rounded-md bg-white p-3 sm:p-4 dark:bg-gray-900 transition-all duration-200 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold">
            {chatType === 'heart_to_heart' 
              ? t('chat.memories.bibi') 
              : memoriesType === 'plans' 
                ? 'Kế hoạch hằng ngày' 
                : memoriesType === 'habits' 
                  ? 'Thói quen và sở thích' 
                  : t('chat.memories.noma')
            }
          </h2>
          <button onClick={onClose} className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800">✕</button>
        </div>

        <div className="max-h-80 overflow-y-auto custom-scrollbar">
          {memories.length === 0 ? (
            <div className="text-sm text-gray-500">
              {chatType === 'heart_to_heart' 
                ? t('chat.memories.noMemories') 
                : memoriesType === 'plans' 
                  ? 'Chưa có kế hoạch nào' 
                  : memoriesType === 'habits' 
                    ? 'Chưa có thói quen nào' 
                    : t('chat.memories.noPlans')
              }
            </div>
          ) : (
            <ul className="space-y-2">
              {groupMemories(memories).reverse().map((item, idx) => {
                const { text, plans, isCombined, ts, isHabit, weekday } = item;
                return (
                  <li key={idx} className="rounded border p-2 text-sm dark:border-gray-700">
                    <div className="font-medium break-words">{text}</div>
                    {ts && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ts}</div>
                    )}
                    {plans && plans.length > 0 && (
                      <ul className="mt-2 ml-4 list-disc space-y-1">
                        {plans.map((plan, planIdx) => (
                          <li key={planIdx} className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
                            <span className="flex-1 pr-2">{plan}</span>
                            {isHabit && weekday && (
                              <button
                                onClick={() => handleDeleteHabit(weekday, planIdx)}
                                disabled={deletingHabit === `${weekday}-${planIdx}`}
                                className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 px-2 py-1 rounded text-sm font-bold transition-colors"
                                title="Xóa thói quen này"
                              >
                                {deletingHabit === `${weekday}-${planIdx}` ? '...' : '✕'}
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}



