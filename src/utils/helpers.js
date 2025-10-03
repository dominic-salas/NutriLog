/**
 * Common utilities for CalorieScan app
 */

/**
 * Format calorie value with proper units
 * @param {number} calories - Calorie value
 * @returns {string} Formatted string
 */
export const formatCalories = (calories) => {
  return `${Math.round(calories)} kcal`;
};

/**
 * Format macronutrient value
 * @param {number} grams - Grams of macronutrient
 * @returns {string} Formatted string
 */
export const formatMacro = (grams) => {
  return `${grams.toFixed(1)}g`;
};

/**
 * Calculate total daily calories from macros
 * @param {number} protein - Protein in grams
 * @param {number} carbs - Carbs in grams
 * @param {number} fat - Fat in grams
 * @returns {number} Total calories
 */
export const calculateCalories = (protein, carbs, fat) => {
  // Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
  return (protein * 4) + (carbs * 4) + (fat * 9);
};

/**
 * Get color based on calorie level
 * @param {number} calories - Calorie value
 * @returns {string} Color code
 */
export const getCalorieColor = (calories) => {
  if (calories < 100) return '#4CAF50'; // Green - low
  if (calories < 300) return '#FFC107'; // Yellow - medium
  return '#F44336'; // Red - high
};
