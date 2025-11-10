import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { redirectToGoogleOAuth } from '../../utils/oauth';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LoginCard() {
  const { login } = useAuth();
  const { t } = useLanguage();

  async function handleGoogleLogin() {
    redirectToGoogleOAuth();
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl">
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 px-6 py-5">
        <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="logo" className="h-8 w-8 rounded-full shadow-sm" />
        <div className="text-lg font-bold text-gray-900 dark:text-white">{t('appName')}</div>
      </div>
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('auth.loginToContinue')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('auth.useGoogleToChat')}</p>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white transition hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm"
        >
          <img src={process.env.PUBLIC_URL + '/images/google.svg'} alt="Google" className="h-5 w-5" />
          <span>{t('auth.loginWithGoogle')}</span>
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('auth.agreeTermsShort')}
          </p>
        </div>
      </div>
    </div>
  );
}


