import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ChatSelection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const NOMA_IMAGE_URL = process.env.PUBLIC_URL + '/images/noma.png';
  const BIBI_IMAGE_URL = process.env.PUBLIC_URL + '/images/bibi.png';

  const handlePlanningChat = () => {
    navigate('/chat/planning');
  };

  const handleHeartToHeartChat = () => {
    navigate('/chat/heart-to-heart');
  };

  return (
    <div className="h-full bg-gradient-to-br from-white via-gray-50 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 sm:p-6">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight px-2">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('chat.selectAssistant')}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              {t('chat.selectAssistantDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          <div 
            onClick={handlePlanningChat}
              className="group cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 hover:shadow-3xl hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden order-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/30 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="text-center relative z-10">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 mb-3 sm:mb-4 ring-4 ring-indigo-100 dark:ring-indigo-900/30 group-hover:ring-indigo-200 dark:group-hover:ring-indigo-800/50 transition-all duration-300">
                  <img src={NOMA_IMAGE_URL} alt="Noma" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="mb-3 sm:mb-4">
                  <span className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 text-indigo-800 dark:text-indigo-200 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold mb-2 sm:mb-3 shadow-sm">
                    <svg className="w-3 h-3 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    {t('chat.planningRole')}
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent mb-2 sm:mb-3">
                    Noma
                  </h3>
                </div>
                
                <p className="text-sm sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 mb-4 sm:mb-6 line-clamp-3 px-2">
                  {t('chat.planningGreeting')}
                </p>
                
                <button className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 group/btn w-full sm:w-auto">
                  {t('chat.startChat')}
                  <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300" style={{animationDelay: '0.1s'}}></div>
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-indigo-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300" style={{animationDelay: '0.3s'}}></div>
            </div>
          </div>

          <div 
            onClick={handleHeartToHeartChat}
              className="group cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 hover:shadow-3xl hover:border-pink-300 dark:hover:border-pink-500 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden order-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-950/30 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="text-center relative z-10">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/50 mb-3 sm:mb-4 ring-4 ring-pink-100 dark:ring-pink-900/30 group-hover:ring-pink-200 dark:group-hover:ring-pink-800/50 transition-all duration-300">
                  <img src={BIBI_IMAGE_URL} alt="Bibi" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="mb-3 sm:mb-4">
                  <span className="inline-flex items-center bg-gradient-to-r from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 text-pink-800 dark:text-pink-200 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold mb-2 sm:mb-3 shadow-sm">
                    <svg className="w-3 h-3 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {t('chat.heartToHeartRole')}
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent mb-2 sm:mb-3">
                    Bibi
                  </h3>
                </div>
                
                <p className="text-sm sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 mb-4 sm:mb-6 line-clamp-3 px-2">
                  {t('chat.heartToHeartGreeting')}
                </p>
                
                <button className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg sm:rounded-xl hover:from-pink-700 hover:to-pink-800 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 group/btn w-full sm:w-auto">
                  {t('chat.startChat')}
                  <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300" style={{animationDelay: '0.1s'}}></div>
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300" style={{animationDelay: '0.3s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
