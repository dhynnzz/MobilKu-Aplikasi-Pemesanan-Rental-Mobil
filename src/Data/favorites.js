// Global memory state for favorite cars
let favoriteIds = [1, 3]; // Initial favorites: Avanza (ID 1) and Pajero (ID 3)

export const getFavorites = () => {
  return [...favoriteIds];
};

export const addFavorite = (id) => {
  if (!favoriteIds.includes(id)) {
    favoriteIds.push(id);
  }
};

export const removeFavorite = (id) => {
  favoriteIds = favoriteIds.filter(favId => favId !== id);
};

export const isFavorite = (id) => {
  return favoriteIds.includes(id);
};
