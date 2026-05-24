// Global memory state for application settings
let settingsData = {
  language: 'id', // 'id' (Indonesian) or 'en' (English)
  darkMode: false, // true (Dark Mode) or false (Light Mode)
};

export const getSettings = () => {
  return { ...settingsData };
};

export const updateSettings = (newSettings) => {
  settingsData = { ...settingsData, ...newSettings };
};
