// components/profile/CoinWallet.tsx
import React from 'react';
import { Card, List, Tag, Statistic, Button } from 'antd';
import { GiftOutlined, HistoryOutlined } from '@ant-design/icons';
import { CoinHistory, DailyRewardHistory } from '../../types/profile';
import { useNavigate } from 'react-router-dom';

interface CoinWalletProps {
  balance: number;
  history: [
    {
      id: string,
      amount: number,
      reason: string,
      created_at: string,
      weekday: string
    }
  ];
}

const CoinWallet: React.FC<CoinWalletProps> = ({ balance, history }) => {
  const nav = useNavigate();
  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="!shadow-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Số dư xu của bạn</div>
          <Statistic
            value={balance}
            prefix={<GiftOutlined />}
            suffix="xu"
            valueStyle={{ color: '#ff7300ff', fontSize: '48px' }}
          />
          <div className="mt-4">
            <Button type="primary" size="large" className="bg-white text-orange-500 border-white" onClick={()=>nav("/reward")}>
              Đổi xu lấy voucher
            </Button>
          </div>
        </div>
      </Card>

      {/* History */}
      <Card 
        title={
          <span className="flex items-center gap-2">
            <HistoryOutlined />
            Lịch sử giao dịch xu
          </span>
        }
        className="!shadow-sm"
      >
        <List
          dataSource={history}
          renderItem={(item) => (
            <List.Item>
              <div className="flex justify-between items-center w-full">
                <div>
                  <div className="font-medium">{item.reason}</div>
                  <div className="text-gray-500 text-sm">
                    {new Date(item.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div className="text-right">
                  <div className={item.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                    {item.amount > 0 ? '+' : ''}{item.amount} xu
                  </div>
                  {item.reason.includes("daily_login") ? <div className="text-gray-500 text-sm">
                    Thứ: {item.weekday}
                  </div>:<></>}
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default CoinWallet;