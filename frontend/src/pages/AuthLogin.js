import React from 'react';
import Navbar from '../components/Layout/Navbar';
import LoginCard from '../components/Auth/LoginCard';
import { useLanguage } from '../contexts/LanguageContext';

export default function AuthLogin() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" id="auth-login-container">
      <Navbar showAuthButton={true} showNavLinks={true} hideLoginButton={true} />

      <div className="flex-1 flex items-center justify-center p-4 pt-20 sm:pt-24">
        <div className="w-full max-w-md">
          <LoginCard />
        </div>
      </div>

      <div className="text-center p-4 text-sm text-gray-500 dark:text-gray-400">
        <p>{t('auth.agreeTermsLong')}</p>
      </div>
    </div>
  );
}