import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Layout/Navbar';

export default function PrivacyPolicy() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const formatTranslation = (key, params = {}) => {
    let text = t(key);
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    return text;
  };

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderContent = (content) => {
    if (Array.isArray(content)) {
      return (
        <ul className="space-y-3">
          {content.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="text-gray-600 dark:text-gray-300 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    return <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{content}</p>;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar showAuthButton={true} showNavLinks={true} />

      <div className="pt-20 sm:pt-24 lg:pt-28 bg-gradient-to-br from-white via-gray-50 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {t('home.privacy.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              {formatTranslation('home.privacy.lastUpdated', { date: currentDate })}
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-12 space-y-8 sm:space-y-12">
              
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.privacy.sections.intro.title')}
                </h2>
                {renderContent(t('home.privacy.sections.intro.content'))}
              </section>

              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.privacy.sections.dataCollection.title')}
                </h2>
                {renderContent(t('home.privacy.sections.dataCollection.content'))}
              </section>

              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.privacy.sections.dataUsage.title')}
                </h2>
                {renderContent(t('home.privacy.sections.dataUsage.content'))}
              </section>

              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.privacy.sections.dataSecurity.title')}
                </h2>
                {renderContent(t('home.privacy.sections.dataSecurity.content'))}
              </section>

              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.privacy.sections.userRights.title')}
                </h2>
                {renderContent(t('home.privacy.sections.userRights.content'))}
              </section>

              <section className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.privacy.sections.contact.title')}
                </h2>
                {renderContent(t('home.privacy.sections.contact.content'))}
              </section>

            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 group"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}