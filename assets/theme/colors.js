// Warna utama (tanpa function → aman dipakai langsung)
const colors = {
  grey: "#6D7D9A",
  blue: "#3558E1",
  white: "#FFFFFF",
  black: "#000000",
  darkModeBlack: "#1B1B1B",
  darkModeBlue: "#929CF1",

  // Versi dengan opacity (opsional kalau dibutuhkan)
  greyOpacity: (opacity = 1) => `rgba(109, 125, 154, ${opacity})`,
  blueOpacity: (opacity = 1) => `rgba(53, 88, 225, ${opacity})`,
  whiteOpacity: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  blackOpacity: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

export default colors;