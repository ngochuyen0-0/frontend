import { UserProfile, UserProfiles } from "../types/profile";
import apiClient from "../utils/apiClient";

export const getUserProfiles = async (filters: {
    id?: string,
    searchKeyword?: string,
    page?: number,
    row?: number
}) => {
    const res = await apiClient.post("/user/get", filters);
    return res.data as UserProfiles;
};