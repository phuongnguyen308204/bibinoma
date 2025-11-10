import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import { useLanguage } from '../contexts/LanguageContext';

export default function QRCodePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const qrcode = location.state?.qrcode || '';
  const isImageLike = typeof qrcode === 'string' && (qrcode.startsWith('http://') || qrcode.startsWith('https://') || qrcode.startsWith('data:image'));
  const qrImgSrc = isImageLike ? qrcode : (qrcode ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(qrcode)}` : '');
  const amount = location.state?.amount || 0;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(qrcode);
      alert(t('qrcode.copySuccess'));
    } catch (_) {
      alert(t('qrcode.copyFail'));
    }
  };

  const downloadQR = async () => {
    try {
      if (!qrImgSrc) return;
      const res = await fetch(qrImgSrc, { credentials: 'omit' });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (_) {
      alert(t('qrcode.downloadFail'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar showAuthButton={true} showNavLinks={true} />
      <div className="flex-1 pt-24 sm:pt-28 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('qrcode.title')}</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t('qrcode.subtitle')}</p>
            </div>

            <div className="px-6 pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('qrcode.amount')}</div>
                <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {new Intl.NumberFormat('vi-VN').format(amount)}₫
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center">
                {qrcode ? (
                  <div className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-900 p-3 shadow-sm">
                    <img
                      src={qrImgSrc}
                      alt="QR Code"
                      className="mx-auto w-60 h-auto"
                    />
                  </div>
                ) : (
                  <div className="text-red-600">{t('qrcode.noQR')}</div>
                )}

                <p className="mt-6 text-sm text-gray-700 dark:text-gray-300 text-center">
                  {t('qrcode.successNote')}
                </p>
                <div className="mt-4 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={downloadQR}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M8 12l4 4m0 0l4-4m-4 4V4"/></svg>
                    {t('qrcode.download')}
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow"
                  >
                    Trang chủ
                  </button>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    {t('qrcode.back')}
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}


