import axios from "axios";

// Create axios instance
export const api = axios.create({
  baseURL: "http://localhost:8000", // Make sure this matches your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token if needed
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.auth_token) {
          config.headers.Authorization = `Basic ${user.auth_token}`;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle specific error codes here
    if (error.response?.status === 401) {
      console.error("Authentication error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

// Share API methods
export const shareApi = {
  // Send a share request using username
  sendRequest: async (toUsername: string, permission: string = "view") => {
    const userStr = localStorage.getItem("user");
    if (!userStr) throw new Error("User not logged in");
    
    const user = JSON.parse(userStr);
    if (!user.id) throw new Error("User ID not found");
    
    console.log("Sending share request:", { from_user_id: user.id, to_username: toUsername, permission });
    
    const response = await api.post("/share/request", {
      from_user_id: user.id,
      to_username: toUsername,
      permission
    });
    return response.data;
  },

  // Get received requests
  getReceivedRequests: async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) throw new Error("User not logged in");
    
    const user = JSON.parse(userStr);
    if (!user.id) throw new Error("User ID not found");
    
    const response = await api.get(`/share/received/${user.id}`);
    return response.data;
  },

  // Get sent requests
  getSentRequests: async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) throw new Error("User not logged in");
    
    const user = JSON.parse(userStr);
    if (!user.id) throw new Error("User ID not found");
    
    const response = await api.get(`/share/sent/${user.id}`);
    return response.data;
  },

  // Accept a request
  acceptRequest: async (requestId: string) => {
    const response = await api.post("/share/respond", {
      request_id: requestId,
      action: "accept"
    });
    return response.data;
  },

  // Reject a request
  rejectRequest: async (requestId: string) => {
    const response = await api.post("/share/respond", {
      request_id: requestId,
      action: "reject"
    });
    return response.data;
  },

  // Get users who shared with me
  getSharedWith: async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) throw new Error("User not logged in");
    
    const user = JSON.parse(userStr);
    if (!user.id) throw new Error("User ID not found");
    
    const response = await api.get(`/share/shared-with/${user.id}`);
    return response.data;
  }
};

// Auth API methods (optional - for better organization)
export const authApi = {
  changePassword: async (current_password: string, new_password: string) => {
    const response = await api.post("/change-password", {
      current_password,
      new_password
    });
    return response.data;
  }
};

// Also export the api as default if needed
export default api;