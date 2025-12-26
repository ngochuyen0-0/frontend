import { DailyRewardHistory } from "../types/profile";
import apiClient from "../utils/apiClient";

export const takeDaily = async () => {
    const res = await apiClient.get("/points/take-daily");
    return res.data;
}

export const getWeeklyTaken = async () => {
    const res = await apiClient.get("/points/get-weekly-taken");
    return res.data as DailyRewardHistory;
}