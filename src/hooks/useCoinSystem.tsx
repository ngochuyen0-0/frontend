// hooks/useCoinSystem.ts
import { useState, useEffect } from 'react';
import { message } from 'antd';

interface CoinSystem {
  userCoins: number;
  dailyCoins: number;
  showCoinPopup: boolean;
  lastLoginDate: string | null;
  loginStreak: number;
}

export const useCoinSystem = () => {
  const [coinSystem, setCoinSystem] = useState<CoinSystem>({
    userCoins: 0,
    dailyCoins: 50, // Số xu mặc định mỗi ngày
    showCoinPopup: false,
    lastLoginDate: null,
    loginStreak: 0
  });

  // Kiểm tra khi user login
  const checkDailyLogin = () => {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('lastLoginDate');
    
    // Nếu chưa từng login hoặc login ngày khác
    if (!lastLogin || lastLogin !== today) {
      setCoinSystem(prev => ({
        ...prev,
        showCoinPopup: true
      }));
      
      // Cập nhật streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLogin === yesterday.toDateString()) {
        // Login liên tục
        setCoinSystem(prev => ({
          ...prev,
          loginStreak: prev.loginStreak + 1
        }));
      } else if (!lastLogin) {
        // Login lần đầu
        setCoinSystem(prev => ({
          ...prev,
          loginStreak: 1
        }));
      } else {
        // Break streak
        setCoinSystem(prev => ({
          ...prev,
          loginStreak: 1
        }));
      }
      
      // Lưu ngày login hôm nay
      localStorage.setItem('lastLoginDate', today);
    }
  };

  // Claim xu
  const claimDailyCoins = async () => {
    try {
      const coinsToAdd = coinSystem.dailyCoins + (coinSystem.loginStreak >= 3 ? 10 : 0);
      
      // Gọi API để cập nhật xu
      // await userApi.updateCoins(coinsToAdd);
      
      setCoinSystem(prev => ({
        ...prev,
        userCoins: prev.userCoins + coinsToAdd,
        showCoinPopup: false
      }));
      
      return coinsToAdd;
    } catch (error) {
      throw error;
    }
  };

  return {
    coinSystem,
    checkDailyLogin,
    claimDailyCoins,
    setCoinSystem
  };
};