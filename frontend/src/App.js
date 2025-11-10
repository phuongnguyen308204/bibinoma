import React, { useMemo, useState } from 'react';
import './App.css';
import './styles/animations.css';
import ChatMessages from './components/Chat/ChatMessages';
import ChatInput from './components/Chat/ChatInput';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ChatProvider } from './contexts/ChatContext';
import { ModalProvider } from './contexts/ModalContext';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Pricing from './pages/Pricing';
import AuthLogin from './pages/AuthLogin';
import ChatSelection from './components/Chat/ChatSelection';
import PlanningChat from './pages/PlanningChat';
import HeartToHeartChat from './pages/HeartToHeartChat';
import HomePage from './pages/HomePage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import QRCodePage from './pages/QRCodePage';
import { useAuth } from './contexts/AuthContext';
import LoginCard from './components/Auth/LoginCard';
import { useLanguage } from './contexts/LanguageContext';
import { useChat } from './contexts/ChatContext';
import ModalManager from './components/Modal/ModalManager';

function App() {
  const providers = useMemo(
    () => (
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ChatProvider>
              <ModalProvider>
                <InnerApp />
                <ModalManager />
              </ModalProvider>
            </ChatProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    ),
    []
  );
  return providers;
}

function InnerApp() {
  const { t } = useLanguage();
  const [chatTitle, setChatTitle] = useState('');

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/login" element={<AuthLogin />} />
      <Route
        path="/pricing"
        element={
          <RequireLogin>
            <Pricing />
          </RequireLogin>
        }
      />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route
        path="/qrcode"
        element={
          <RequireLogin>
            <QRCodePage />
          </RequireLogin>
        }
      />
      <Route
        path="/chat/planning"
        element={
          <RequireLogin>
            <PlanningChat />
          </RequireLogin>
        }
      />
      <Route
        path="/chat/heart-to-heart"
        element={
          <RequireLogin>
            <HeartToHeartChat />
          </RequireLogin>
        }
      />
    </Routes>
  );
}

export default App;

function RequireLogin({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-700 border-t-indigo-500" />
      </div>
    );
  }
  if (!user) {
    // Redirect to home page instead of showing login card
    navigate('/');
    return null;
  }
  return children;
}
