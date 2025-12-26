import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import { useCoinSystem } from "../hooks/useCoinSystem";
import { useEffect, useState } from "react";
import DailyCoinPopup from "../components/DailyCoinPopup";
import Footer from "../components/footer/Footer";
import { UserProfile } from "../types/profile";
import { getInfo } from "../services/authService";
import { getWeeklyTaken } from "../services/pointService";

export const MainLayout = () => {
    const { coinSystem, checkDailyLogin, setCoinSystem } = useCoinSystem();
    const [userInfo, setUserInfo] = useState<UserProfile>()

    useEffect(() => {
        getWeeklyTaken().then(res => {
            const pointData = res.history.find(e => new Date(e.created_at).getDay() == new Date().getDay())
            if (pointData) {
                setCoinSystem((prev) => ({
                    ...prev,
                    showCoinPopup: false,
                }));
            } else {
                setCoinSystem((prev) => ({
                    ...prev,
                    showCoinPopup: true,
                }));
            }

        }).catch(()=>{
            
        })
    }, []);

    const handleCloseCoinPopup = () => {
        setCoinSystem((prev) => ({
            ...prev,
            showCoinPopup: false,
        }));
    };



    return (
        <div>
            <Header />
            <Outlet />

            <DailyCoinPopup
                visible={coinSystem.showCoinPopup}
                onClose={() =>
                    setCoinSystem((prev) => ({ ...prev, showCoinPopup: false }))
                }
                userCoins={coinSystem.userCoins}
            />
            <Footer />
        </div>
    );
};
