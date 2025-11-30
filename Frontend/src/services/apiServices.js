import api from "./api";

const apiServices = () => {
    return {
        registerUser: (data) => api.post("/users/register", data),
        loginUser: (data) => api.post("/users/login", data),
        getCurrentUser: () => api.get("/users/current-user"),
        sendOTP: (data) => api.post("/users/forgot-password/send-otp", data),
        resetPassword: (data) => api.post("/users/forgot-password/reset", data),
        getNgoList: () => api.get("/ngos/ngo"),
        changePassword: (data) => api.post("/users/change-password", data),
        logoutUser: () => api.post("/users/logout"),
        getConnectedUsers: () => api.get("/ngos/ngo/get-ngo-users"),
        getNgoById: (id) => api.get(`/ngos/ngo/${id}`),
        // Report related APIs
        getUserReports: (query) => api.get(`/reports/user/my-reports?${query}`),        
        createReport: (data) => api.post("/reports/create", data),

        getNgoReports: (query) => api.get(`/reports/ngo/reports?${query}`),
        getNgoReportById: (reportId) => api.get(`/reports/ngo/${reportId}`),
        updateReportStatus: (reportId, data) => api.patch(`/reports/ngo/${reportId}/status`, data),
        // Admin related APIs
        getNgoForAdmin: (query) => api.get(`/admin/admin/ngos?${query}`),
        getUsersForAdmin: () => api.get("/admin/admin/users"),
        verifyNGO: (ngoId, data) => api.post(`/admin/admin/ngos/${ngoId}/approve`, data),
        revokeNGOVerification: (ngoId, data) => api.post(`/admin/admin/ngos/${ngoId}/revoke`, data),
        rejectNGO: (ngoId, data) => api.post(`/admin/admin/ngos/${ngoId}/reject`, data),
        getVerificationStats: () => api.get("/admin/admin/ngos/stats"),
        updateNGODetails: (ngoId, data) => api.patch(`/admin/admin/ngo/${ngoId}`, data),
    };
};
const ApiService = apiServices();
export default ApiService;