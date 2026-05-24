// Global memory state for user profile
let profileData = {
  name: "Ejakkk",
  email: "Ejakk123@gmail.com",
  phone: "081234567890",
  avatar: "https://i.pravatar.cc/100"
};

export const getProfile = () => {
  return { ...profileData };
};

export const updateProfile = (newData) => {
  profileData = { ...profileData, ...newData };
};
