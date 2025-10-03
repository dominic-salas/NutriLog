/**
 * Nutrition database with common foods
 * In a production app, this would be replaced with a real database or API
 * Consider using APIs like:
 * - USDA FoodData Central
 * - Nutritionix API
 * - Edamam Nutrition API
 * - Open Food Facts
 */
export const nutritionDatabase = {
  apple: {
    name: 'Apple',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    servingSize: '1 medium (182g)',
  },
  banana: {
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    servingSize: '1 medium (118g)',
  },
  chicken_breast: {
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100g cooked',
  },
  salmon: {
    name: 'Salmon',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    servingSize: '100g cooked',
  },
  broccoli: {
    name: 'Broccoli',
    calories: 55,
    protein: 3.7,
    carbs: 11,
    fat: 0.6,
    servingSize: '1 cup (156g)',
  },
  rice: {
    name: 'White Rice',
    calories: 205,
    protein: 4.3,
    carbs: 45,
    fat: 0.4,
    servingSize: '1 cup cooked (158g)',
  },
  eggs: {
    name: 'Egg',
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fat: 5.3,
    servingSize: '1 large (50g)',
  },
  avocado: {
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 15,
    servingSize: '1/2 avocado (100g)',
  },
  pasta: {
    name: 'Pasta',
    calories: 220,
    protein: 8,
    carbs: 43,
    fat: 1.3,
    servingSize: '1 cup cooked (140g)',
  },
  pizza: {
    name: 'Pizza Slice',
    calories: 285,
    protein: 12,
    carbs: 36,
    fat: 10,
    servingSize: '1 slice (107g)',
  },
  burger: {
    name: 'Hamburger',
    calories: 354,
    protein: 20,
    carbs: 33,
    fat: 16,
    servingSize: '1 burger (150g)',
  },
  salad: {
    name: 'Garden Salad',
    calories: 145,
    protein: 6,
    carbs: 15,
    fat: 8,
    servingSize: '1 bowl (300g)',
  },
};
