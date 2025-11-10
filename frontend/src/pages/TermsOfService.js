import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Layout/Navbar';

export default function TermsOfService() {
  const { t } = useLanguage();

  // Helper function to replace placeholders in translation strings
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

  // Scroll to top on mount
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
              <span className="text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    return <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{content}</p>;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar showAuthButton={true} showNavLinks={true} />

      {/* Main Content */}
      <div className="pt-20 sm:pt-24 lg:pt-28 bg-gradient-to-br from-white via-gray-50 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {t('home.terms.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              {formatTranslation('home.terms.lastUpdated', { date: currentDate })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-12 space-y-8 sm:space-y-12">

              {/* Acceptance */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.terms.sections.acceptance.title')}
                </h2>
                {renderContent(t('home.terms.sections.acceptance.content'))}
              </section>

              {/* Service Description */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.terms.sections.serviceDescription.title')}
                </h2>
                {renderContent(t('home.terms.sections.serviceDescription.content'))}
              </section>

              {/* User Responsibilities */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.terms.sections.userResponsibilities.title')}
                </h2>
                {renderContent(t('home.terms.sections.userResponsibilities.content'))}
              </section>

              {/* Prohibited Uses */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.terms.sections.prohibitedUses.title')}
                </h2>
                {renderContent(t('home.terms.sections.prohibitedUses.content'))}
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.terms.sections.intellectualProperty.title')}
                </h2>
                {renderContent(t('home.terms.sections.intellectualProperty.content'))}
              </section>

              {/* Privacy */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.terms.sections.privacy.title')}
                </h2>
                {renderContent(t('home.terms.sections.privacy.content'))}
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.terms.sections.limitationOfLiability.title')}
                </h2>
                {renderContent(t('home.terms.sections.limitationOfLiability.content'))}
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.terms.sections.termination.title')}
                </h2>
                {renderContent(t('home.terms.sections.termination.content'))}
              </section>

              {/* Changes */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.terms.sections.changes.title')}
                </h2>
                {renderContent(t('home.terms.sections.changes.content'))}
              </section>

              {/* Contact */}
              <section className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('home.terms.sections.contact.title')}
                </h2>
                {renderContent(t('home.terms.sections.contact.content'))}
              </section>

            </div>
          </div>

          {/* Back to Home Button */}
          <div className="text-center mt-12">
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 group"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Về trang chủ
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
