// components/DailyCoinPopup.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Progress, message, Row, Col } from 'antd';
import {
  GiftOutlined,
  FireOutlined,
  TrophyOutlined,
  CloseOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { getWeeklyTaken, takeDaily } from '../services/pointService';
import { getInfo } from '../services/authService';
import { DailyRewardHistory, UserProfile } from '../types/profile';

interface DailyReward {
  day: number; // 1-7
  coins: number;
  claimed: boolean;
  date: string; // Ngày cụ thể
  isToday: boolean;
}


interface DailyCoinPopupProps {
  visible: boolean;
  onClose: () => void;
  userCoins: number;
}

const DailyCoinPopup: React.FC<DailyCoinPopupProps> = ({
  visible,
  onClose,
  userCoins
}) => {
  const [claiming, setClaiming] = useState(false);
  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>([]);
  const [dailyRewardHistory, setDailyRewardHistory] = useState<DailyRewardHistory>();
  const [loginStreak, setLoginStreak] = useState(0);
  const [userInfo, setUserInfo] = useState<UserProfile>();

  useEffect(() => {
    getWeeklyTaken().then(res => {
      setDailyRewardHistory(res);
    }).catch();
    getInfo().then(res => {
      setUserInfo(res)
    }).catch();
  }, [claiming])

  useEffect(() => {
    if (dailyRewardHistory) {
      initializeWeekRewards();
    }
  }, [dailyRewardHistory]);



  const initializeWeekRewards = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Start from Monday
    const history = dailyRewardHistory?.history;

    const rewards: DailyReward[] = [];

    // Tạo 7 ngày trong tuần
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const isToday = date.toDateString() === today.toDateString();

      const claimed = history?.find(h => (new Date(h.created_at)).getDay() == (date.getDay())) ? true : false
      const coins = calculateCoins(i + 1); // Ngày càng nhiều xu

      rewards.push({
        day: i + 1,
        coins,
        claimed,
        date: date.toDateString(),
        isToday
      });
    }

    setDailyRewards(rewards);
    setLoginStreak(calculateStreak(rewards));
  };

  const calculateCoins = (day: number): number => {
    // Xu tăng dần theo ngày: 10, 20, 30, 40, 50, 60, 100
    const baseCoins = [10, 20, 30, 40, 50, 60, 100];
    return baseCoins[day - 1] || 50;
  };

  const calculateStreak = (rewards: DailyReward[]): number => {
    // Tính streak - số ngày login liên tiếp
    let streak = 0;
    for (let i = rewards.length - 1; i >= 0; i--) {
      if (rewards[i].claimed) streak++;
      else break;
    }
    return streak;
  };

  const getTodayReward = () => {
    return dailyRewards.find(reward => reward.isToday);
  };

  const handleClaimCoins = async () => {
    const todayReward = getTodayReward();
    if (!todayReward) return;

    setClaiming(true);
    try {
      takeDaily().then(res => {

      }).catch();

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Cập nhật UI
      setDailyRewards(prev =>
        prev.map(reward =>
          reward.isToday ? { ...reward, claimed: true } : reward
        )
      );

      setLoginStreak(prev => prev + 1);

      message.success(`🎉 Bạn đã nhận ${todayReward.coins} xu!`);

    } catch (error) {
      message.error('Có lỗi xảy ra khi nhận xu');
    } finally {
      setClaiming(false);
    }
  };

  const todayReward = getTodayReward();
  const canClaimToday = todayReward && !todayReward.claimed;

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      closable={false}
      maskClosable={true}
      className="daily-coin-popup"
      closeIcon={<CloseOutlined className="text-gray-500" />}
    >
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <TrophyOutlined className="text-2xl text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Quà Đăng Nhập Hàng Ngày
          </h2>
          <p className="text-gray-600">
            Đăng nhập mỗi ngày để nhận xu miễn phí!
          </p>
        </div>

        {/* Streak Info */}
        <Card size="small" className="mb-6 !shadow-sm bg-orange-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FireOutlined className="text-orange-500" />
              <span className="font-semibold">Chuỗi đăng nhập: {dailyRewardHistory?.current_streak} ngày</span>
            </div>
            <div className="text-orange-600 font-semibold">
              +{todayReward?.coins || 0} xu hôm nay
            </div>
          </div>
          <Progress
            percent={((dailyRewardHistory?.current_streak || 0) / 7) * 100}
            size="small"
            strokeColor="#ff6b35"
            className="mt-2"
            showInfo={false}
          />
        </Card>

        {/* Week Calendar */}
        <div className="mb-6">
          <div className="grid grid-cols-7 gap-2">
            {dailyRewards.map((reward) => (
              <div
                key={reward.day}
                className={`
                  relative p-3 rounded-lg text-center border-2 transition-all
                  ${reward.claimed
                    ? 'bg-gray-100 border-yellow-300 text-yellow-400'
                    : reward.isToday
                      ? 'bg-yellow-50 border-yellow-400 shadow-sm'
                      : 'bg-white border-gray-200'
                  }
                  ${reward.isToday && !reward.claimed ? 'animate-pulse' : ''}
                `}
              >
                {/* Day Number */}
                <div className={`
                  text-sm font-semibold mb-1 text-nowarp
                  ${reward.claimed ? 'text-gray-400' : 'text-gray-700'}
                `}>
                  {reward.day}
                </div>

                {/* Coin Amount */}
                <div className={`
                  text-auto font-bold text-nowarp
                  ${reward.claimed ? 'text-orange-300' : 'text-yellow-600'}
                `}>
                  {reward.coins}
                </div>

                {/* Status Icon */}
                <div className="absolute -top-1 -right-1">
                  {reward.claimed ? (
                    <CheckCircleOutlined className="text-green-500 text-sm" />
                  ) : reward.isToday ? (
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  ) : null}
                </div>

                {/* Day Label */}
                <div className={`
                  text-xs mt-1
                  ${reward.claimed ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  {reward.day === 7 ? 'CN' : `T${reward.day + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Balance */}
        <Card size="small" className="mb-6 !shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Số dư hiện tại:</span>
            <div className="flex items-center gap-1">
              <span className="text-2xl">🪙</span>
              <span className="text-xl font-bold text-yellow-600">{userInfo?.loyalty_points?.find(p => p.source == "daily_login")?.points}</span>
              <span className="text-gray-600">xu</span>
            </div>
          </div>
        </Card>

        {/* Claim Button */}
        {canClaimToday ? (
          <Button
            type="primary"
            size="large"
            loading={claiming}
            onClick={handleClaimCoins}
            className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 border-none shadow-lg hover:shadow-xl"
            icon={<GiftOutlined />}
          >
            {claiming ? 'Đang nhận...' : `Nhận ${todayReward.coins} Xu`}
          </Button>
        ) : (
          <Button
            size="large"
            className="w-full h-12"
            disabled
          >
            {todayReward?.claimed ? 'Đã nhận xu hôm nay' : 'Chưa đến ngày'}
          </Button>
        )}

        {/* Footer Note */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            💡 Chuỗi đăng nhập càng dài, số xu nhận được càng nhiều!
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default DailyCoinPopup;