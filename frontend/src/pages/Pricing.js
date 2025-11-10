import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Layout/Navbar';
import chatService from '../services/chatService';
import paymentService from '../services/paymentService';

export default function Pricing() {
  const { t, lang, setLang } = useLanguage();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(20000);
  const [bibiCount, setBibiCount] = useState(0);
  const [nomaCount, setNomaCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadCounts = async () => {
      try {
        const [bibiMem, nomaMem] = await Promise.all([
          chatService.getMemories('heart_to_heart'),
          chatService.getMemories('planning')
        ]);
        if (!isMounted) return;
        setBibiCount(Array.isArray(bibiMem) ? bibiMem.length : 0);
        setNomaCount(Array.isArray(nomaMem) ? nomaMem.length : 0);
      } catch (_) {
        if (!isMounted) return;
        setBibiCount(0);
        setNomaCount(0);
      }
    };
    loadCounts();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar showAuthButton={true} showNavLinks={false} />
      
      <div className="flex-1 pt-24 sm:pt-28 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-8">
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Bảng giá</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-3 sm:p-4 border border-blue-200 dark:border-blue-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">Lưu lịch sử trò chuyện</h3>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">100 vnđ / 1 tin nhắn</p>
                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {Math.floor(amount / 100).toLocaleString()} tin nhắn
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 rounded-lg p-3 sm:p-4 border border-pink-200 dark:border-pink-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-pink-800 dark:text-pink-200">Lưu thông tin cho Bibi</h3>
                </div>
                <p className="text-xs text-pink-700 dark:text-pink-300 mb-2">(100 vnđ + số thông tin Bibi đã lưu * 2 vnđ) / thông tin mới</p>
                <div className="text-lg font-bold text-pink-900 dark:text-pink-100">
                  {(() => {
                    let maxInfo = 0;
                    let totalCost = 0;
                    let currentInfoCost = 100 + bibiCount * 2;
                    
                    while (totalCost + currentInfoCost <= amount) {
                      totalCost += currentInfoCost;
                      maxInfo++;
                      currentInfoCost = 100 + (bibiCount + maxInfo) * 2; 
                    }
                    return maxInfo.toLocaleString();
                  })()} thông tin
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg p-3 sm:p-4 border border-indigo-200 dark:border-indigo-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">Lưu thông tin cho Noma</h3>
                </div>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-2">(100 vnđ + số thông tin Noma đã lưu * 10 vnđ) / thông tin mới</p>
                <div className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                  {(() => {
                    let maxInfo = 0;
                    let totalCost = 0;
                    let currentInfoCost = 100 + nomaCount * 10;
                    
                    while (totalCost + currentInfoCost <= amount) {
                      totalCost += currentInfoCost;
                      maxInfo++;
                      currentInfoCost = 100 + (nomaCount + maxInfo) * 10; 
                    }
                    return maxInfo.toLocaleString();
                  })()} thông tin
                </div>
              </div>
            </div>

            <div className="text-center mb-4 sm:mb-6">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Ngân sách</div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('vi-VN').format(amount)}₫
              </div>
            </div>

            <input
              type="range"
              min="10000"
              max="500000"
              step="10000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>10,000đ</span>
              <span>500,000đ</span>
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={async () => {
                  try {
                    const res = await paymentService.create(amount);
                    const qrcode = res.qrcode || res.QrcodeString || res.qrcodeString || res.qrCode || '';
                    navigate('/qrcode', { state: { qrcode, amount: res.amount || res.Amount || amount } });
                  } catch (e) {
                    alert('Thanh toán lỗi: ' + (e?.message || 'Unknown error'));
                  }
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Thanh toán ngay
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
