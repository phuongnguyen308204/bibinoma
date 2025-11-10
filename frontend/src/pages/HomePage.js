import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import DemoChat from '../components/Chat/DemoChat';
import ChatSelection from '../components/Chat/ChatSelection';
import SettingsModal from '../components/Settings/SettingsModal';
import Navbar from '../components/Layout/Navbar';

export default function HomePage() {
  const { t, lang, setLang } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(20000);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const formatTranslation = (key, params = {}) => {
    let text = t(key);
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    return text;
  };

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    window.scrollTo(0, 0);
    
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  

  const handlePlanningChat = () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    navigate('/chat/planning');
  };

  const handleHeartToHeartChat = () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    navigate('/chat/heart-to-heart');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  if (user) {
    return (
      <div className="h-screen bg-gradient-to-br from-white via-gray-50 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950/30 overflow-hidden">
        <Navbar showAuthButton={true} showNavLinks={true} />
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
              <div 
                onClick={() => navigate('/')}
                className="flex items-center gap-3 sm:gap-4 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="logo" className="h-10 w-10 sm:h-12 sm:w-12" />
                <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('appName')}</span>
              </div>

              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="xl:hidden flex items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-600 min-w-[48px] min-h-[48px] flex-shrink-0 z-[999] relative cursor-pointer select-none"
                title="Menu"
                role="button"
                tabIndex={0}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  userSelect: 'none'
                }}
              >
                <svg className="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" className="pointer-events-none" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" className="pointer-events-none" />
                  )}
                </svg>
              </div>

              <div className="hidden xl:flex items-center gap-1 sm:gap-2 lg:gap-3 transition-all duration-200">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-700/50">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-xs sm:text-sm font-semibold">
                      {t('navbar.balance')} {new Intl.NumberFormat('vi-VN').format(user.money || 0)}{t('navbar.currency')}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => navigate('/pricing')}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm hover:shadow-md transform hover:scale-105 font-medium"
                    title={t('navbar.topUp')}
                  >
                    <span className="hidden sm:inline">{t('navbar.topUp')}</span>
                    <span className="sm:hidden">+</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm font-medium truncate max-w-20 sm:max-w-none">{user.name}</span>
                </div>
                
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title={t('navbar.settings')}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                
                <button
                  onClick={logout}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors font-medium"
                >
                  {t('navbar.logout')}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="xl:hidden fixed top-16 sm:top-18 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm">
            <div className="px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-700/50">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-sm font-semibold">
                    {t('navbar.balance')} {new Intl.NumberFormat('vi-VN').format(user.money || 0)}{t('navbar.currency')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigate('/pricing');
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium"
                >
                  {t('navbar.topUp')}
                </button>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-lg">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-800 dark:text-indigo-200">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400">Online</div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSettingsOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('navbar.settings')}
                </button>
                
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('navbar.logout')}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="h-full pt-16 sm:pt-18">
          <ChatSelection />
        </div>
        
        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-white dark:bg-gray-900" 
      id="homepage-container"
    >
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            <div 
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-3 sm:gap-4 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="logo" className="h-10 w-10 sm:h-12 sm:w-12" />
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('appName')}</span>
            </div>

            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="xl:hidden flex items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-600 min-w-[48px] min-h-[48px] flex-shrink-0 z-[999] relative cursor-pointer select-none"
              title="Menu"
              role="button"
              tabIndex={0}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                userSelect: 'none'
              }}
            >
              <svg className="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" className="pointer-events-none" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" className="pointer-events-none" />
                )}
              </svg>
            </div>

            <div className="hidden xl:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
              >
                {t('home.navigation.about')}
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
              >
                {t('home.navigation.pricing')}
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
              >
                {t('home.navigation.faq')}
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              >
                <span className="text-sm font-medium">
                  {lang === 'vi' ? 'EN' : 'VI'}
                </span>
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={() => navigate('/auth/login')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm hover:shadow-md transform hover:scale-105"
              >
                {t('auth.login')}
              </button>
            </div>

          </div>

          {isMobileMenuOpen && (
            <div ref={mobileMenuRef} className="xl:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
              <div className="px-4 py-4 space-y-3">
                <button
                  onClick={() => {
                    scrollToSection('about');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                >
                  {t('home.navigation.about')}
                </button>
                <button
                  onClick={() => {
                    scrollToSection('pricing');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                >
                  {t('home.navigation.pricing')}
                </button>
                <button
                  onClick={() => {
                    scrollToSection('faq');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                >
                  {t('home.navigation.faq')}
                </button>
                
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cài đặt</span>
                  </div>
                  
                  <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Ngôn ngữ</span>
                    <button
                      onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {lang === 'vi' ? 'Tiếng Việt' : 'English'}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Giao diện</span>
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {theme === 'dark' ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          Sáng
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                          Tối
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      navigate('/auth/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-center rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium"
                  >
                    {t('auth.login')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section id="hero" className="relative pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="mb-6 sm:mb-8">
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 lg:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('chat.welcome')}
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 lg:mb-16 max-w-4xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-5xl mx-auto mb-12 sm:mb-16 lg:mb-20">
              <div 
                onClick={handlePlanningChat}
                className="group cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 lg:p-10 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/30 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="text-center relative z-10">
                  <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 mb-4 sm:mb-6 ring-4 ring-indigo-100 dark:ring-indigo-900/30 group-hover:ring-indigo-200 dark:group-hover:ring-indigo-800/50 transition-all duration-300">
                    <img src={process.env.PUBLIC_URL + '/images/noma.png'} alt="Noma" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    Noma
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                    {t('chat.planningGreeting')}
                  </p>
                  
                  <div className="absolute top-4 right-4 w-3 h-3 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300" style={{animationDelay: '0.1s'}}></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-indigo-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300" style={{animationDelay: '0.3s'}}></div>
                </div>
              </div>

              <div 
                onClick={handleHeartToHeartChat}
                className="group cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 lg:p-10 hover:shadow-2xl hover:border-pink-300 dark:hover:border-pink-500 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-950/30 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="text-center relative z-10">
                  <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/50 mb-4 sm:mb-6 ring-4 ring-pink-100 dark:ring-pink-900/30 group-hover:ring-pink-200 dark:group-hover:ring-pink-800/50 transition-all duration-300">
                    <img src={process.env.PUBLIC_URL + '/images/bibi.png'} alt="Bibi" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
                    Bibi
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                    {t('chat.heartToHeartGreeting')}
                  </p>
                  
                  <div className="absolute top-4 right-4 w-3 h-3 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300" style={{animationDelay: '0.1s'}}></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300" style={{animationDelay: '0.3s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
      </section>


      <section id="about" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {t('home.characters.title')}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12">
              {t('home.characters.subtitle')}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
              {t('home.characters.keywords').map((keyword, index) => (
                <div
                  key={index}
                  className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      {index === 0 && (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                      {index === 1 && (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )}
                      {index === 2 && (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      )}
                      {index === 3 && (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {keyword}
                    </h3>
                  </div>
                  
                  <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-16 sm:space-y-20 lg:space-y-24">
            <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1 bg-gradient-to-br from-white to-pink-50/30 dark:from-gray-700 dark:to-pink-950/20">
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent mb-4 sm:mb-6">
                      {t('home.characters.bibi.name')}
                    </h3>
                  </div>
                  
                  <div className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed space-y-2">
                    {Array.isArray(t('home.characters.bibi.description')) ? 
                      t('home.characters.bibi.description').map((item, index) => (
                        <p key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {item}
                        </p>
                      )) : 
                      <p className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {t('home.characters.bibi.description')}
                      </p>
                    }
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                    {t('home.characters.bibi.traits').map((trait, index) => (
                      <span
                        key={index}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/50 text-pink-800 dark:text-pink-200 rounded-full text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={handleHeartToHeartChat}
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-xl hover:from-pink-700 hover:to-pink-800 transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 group"
                  >
                    Chat với Bibi
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>

                <div className="relative h-[350px] sm:h-[400px] lg:h-[500px] xl:h-[550px] p-3 sm:p-4 lg:p-6 order-1 lg:order-2 bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-950/30 dark:to-transparent">
                  <div className="h-full flex flex-col">
                    <DemoChat character="Bibi" chatType="heartToHeart" />
                  </div>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-60"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-300 rounded-full animate-pulse opacity-40" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-[350px] sm:h-[400px] lg:h-[500px] xl:h-[550px] p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/30 dark:to-transparent">
                  <div className="h-full flex flex-col">
                    <DemoChat character="Noma" chatType="planning" />
                  </div>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-indigo-400 rounded-full animate-pulse opacity-60"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-indigo-300 rounded-full animate-pulse opacity-40" style={{animationDelay: '1s'}}></div>
                </div>
                
                <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-700 dark:to-indigo-950/20">
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent mb-4 sm:mb-6">
                      {t('home.characters.noma.name')}
                    </h3>
                  </div>
                  
                  <div className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed space-y-2">
                    {Array.isArray(t('home.characters.noma.description')) ? 
                      t('home.characters.noma.description').map((item, index) => (
                        <p key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {item}
                        </p>
                      )) : 
                      <p className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {t('home.characters.noma.description')}
                      </p>
                    }
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                    {t('home.characters.noma.traits').map((trait, index) => (
                      <span
                        key={index}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 text-indigo-800 dark:text-indigo-200 rounded-full text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={handlePlanningChat}
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 group"
                  >
                    Chat với Noma
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {t('pricing.title')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('pricing.subtitle')}
            </p>
            <div className="mt-2 text-sm sm:text-base text-indigo-600 dark:text-indigo-300 font-medium">
              {t('pricing.signupBonus')}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 lg:p-10">
              <div className="mb-8 sm:mb-10">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
                  {formatTranslation('pricing.calculator.title', { amount: new Intl.NumberFormat('vi-VN').format(amount) })}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200">{t('pricing.calculator.chatHistory.title')}</h4>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">{t('pricing.calculator.chatHistory.cost')}</p>
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {formatTranslation('pricing.calculator.chatHistory.maxUnit', { count: Math.floor(amount / 100).toLocaleString() })}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 rounded-xl p-4 border border-pink-200 dark:border-pink-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-pink-800 dark:text-pink-200">{t('pricing.calculator.bibiInfo.title')}</h4>
                    </div>
                    <p className="text-xs text-pink-700 dark:text-pink-300 mb-2">{t('pricing.calculator.bibiInfo.cost')}</p>
                    <div className="text-lg font-bold text-pink-900 dark:text-pink-100">
                      {(() => {
                        let maxInfo = 0;
                        let totalCost = 0;
                        let currentInfoCost = 100;
                        
                        while (totalCost + currentInfoCost <= amount) {
                          totalCost += currentInfoCost;
                          maxInfo++;
                          currentInfoCost = 100 + maxInfo * 2;
                        }
                        return formatTranslation('pricing.calculator.bibiInfo.maxUnit', { count: maxInfo.toLocaleString() });
                      })()}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">{t('pricing.calculator.nomaInfo.title')}</h4>
                    </div>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-2">{t('pricing.calculator.nomaInfo.cost')}</p>
                    <div className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                      {(() => {
                        let maxInfo = 0;
                        let totalCost = 0;
                        let currentInfoCost = 100;
                        
                        while (totalCost + currentInfoCost <= amount) {
                          totalCost += currentInfoCost;
                          maxInfo++;
                          currentInfoCost = 100 + maxInfo * 10;
                        }
                        return formatTranslation('pricing.calculator.nomaInfo.maxUnit', { count: maxInfo.toLocaleString() });
                      })()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6 sm:mb-8">
                <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">{t('pricing.slider.budgetLabel')}</div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {new Intl.NumberFormat('vi-VN').format(amount)}₫
                </div>
              </div>
              
              <div className="mb-6 sm:mb-8">
                <div className="relative px-2">
                  <div className="absolute top-1/2 left-2 right-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg transform -translate-y-1/2 z-0"></div>
                  <div 
                    className="absolute top-1/2 left-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transform -translate-y-1/2 z-10 transition-all duration-200"
                    style={{
                      width: `calc(${((amount - 10000) / (500000 - 10000)) * 100}% - 4px)`
                    }}
                  ></div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="10000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="relative w-full h-2 bg-transparent appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 slider-custom z-20"
                  />
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3">
                  <span className="flex flex-col items-start">
                    <span className="font-medium">{t('pricing.slider.minLabel')}</span>
                    <span className="text-xs opacity-75">10,000₫</span>
                  </span>
                  <span className="flex flex-col items-end">
                    <span className="font-medium">{t('pricing.slider.maxLabel')}</span>
                    <span className="text-xs opacity-75">500,000₫</span>
                  </span>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/auth/login');
                      return;
                    }
                    scrollToSection('pricing');
                  }}
                  className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {t('pricing.cta.transfer')}
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4">
                  {t('pricing.cta.security')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.faq.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('home.faq.subtitle')}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('home.faq.questions.what.question')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('home.faq.questions.what.answer')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('home.faq.questions.security.question')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('home.faq.questions.security.answer')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('home.faq.questions.free.question')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('home.faq.questions.free.answer')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 dark:from-gray-950 dark:via-gray-950 dark:to-black text-white py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-600/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="relative">
                  <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="logo" className="h-10 w-10 sm:h-12 sm:w-12" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/20 to-pink-400/20 animate-pulse"></div>
                </div>
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Bibinoma</span>
              </div>
              <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">
                {t('home.footer.description')}
              </p>
            </div>
            
            <div className="col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white">{t('home.footer.product')}</h3>
              <ul className="space-y-3 sm:space-y-4">
                <li>
                  <button 
                    onClick={() => scrollToSection('about')} 
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm sm:text-base hover:translate-x-1 transform inline-block"
                  >
                    {t('home.footer.links.about')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('pricing')} 
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm sm:text-base hover:translate-x-1 transform inline-block"
                  >
                    {t('home.footer.links.pricing')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('faq')} 
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm sm:text-base hover:translate-x-1 transform inline-block"
                  >
                    {t('home.footer.links.faq')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/auth/login')} 
                    className="text-gray-400 hover:text-indigo-400 transition-all duration-300 text-sm sm:text-base hover:translate-x-1 transform inline-block font-medium"
                  >
                    Bắt đầu ngay
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white">{t('home.footer.support')}</h3>
              <ul className="space-y-3 sm:space-y-4">
                <li>
                  <a 
                    href="mailto:example@example.com" 
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold underline underline-offset-4">
                    example@example.com
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/terms')} 
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm sm:text-base hover:translate-x-1 transform inline-block"
                  >
                    {t('home.footer.links.terms')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/privacy')} 
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm sm:text-base hover:translate-x-1 transform inline-block"
                  >
                    {t('home.footer.links.policy')}
                  </button>
                </li>
                
              </ul>
            </div>

            <div className="col-span-1 -mt-2 sm:-mt-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <a href="https://www.facebook.com/bibinomapage" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-blue-400 hover:bg-white/10 hover:border-blue-400/30 shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/40">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.406.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.676V1.325C24 .593 23.406 0 22.675 0z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@Bibinoma" target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-red-500 hover:bg-white/10 hover:border-red-500/30 shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/40">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.003 3.003 0 00-2.115-2.127C19.565 3.5 12 3.5 12 3.5s-7.565 0-9.383.559A3.003 3.003 0 00.502 6.186 31.53 31.53 0 000 12a31.53 31.53 0 00.502 5.814 3.003 3.003 0 002.115 2.127C4.435 20.5 12 20.5 12 20.5s7.565 0 9.383-.559a3.003 3.003 0 002.115-2.127A31.53 31.53 0 0024 12a31.53 31.53 0 00-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 mt-12 sm:mt-16 pt-8 sm:pt-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <p className="text-gray-400 text-sm sm:text-base">{t('home.footer.copyright')}</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Made with ❤️ in Vietnam
                </p>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <button 
                  onClick={() => scrollToSection('hero')}
                  className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-300 hover:scale-110 group"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
