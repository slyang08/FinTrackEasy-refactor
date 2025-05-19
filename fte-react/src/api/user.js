// src/api/user.js
import api from "@/api/axios";

// Function to get user information
export const getUserInfo = async () => {
    try {
        // No need to specify withCredentials here, it's already set in the instance
        const res = await api.get("/auth/me");
        return res.data.user; // Return the user data
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error; // Rethrow the error for handling in the calling function
    }
};
