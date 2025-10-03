import { formatCalories, formatMacro, calculateCalories, getCalorieColor } from '../src/utils/helpers';

describe('Helper Functions', () => {
  describe('formatCalories', () => {
    it('should format calories correctly', () => {
      expect(formatCalories(250)).toBe('250 kcal');
      expect(formatCalories(100.7)).toBe('101 kcal');
    });
  });

  describe('formatMacro', () => {
    it('should format macronutrients correctly', () => {
      expect(formatMacro(25.5)).toBe('25.5g');
      expect(formatMacro(10)).toBe('10.0g');
    });
  });

  describe('calculateCalories', () => {
    it('should calculate total calories from macros', () => {
      // Protein: 10g * 4 = 40, Carbs: 20g * 4 = 80, Fat: 5g * 9 = 45
      // Total: 165 kcal
      expect(calculateCalories(10, 20, 5)).toBe(165);
    });

    it('should handle zero values', () => {
      expect(calculateCalories(0, 0, 0)).toBe(0);
    });
  });

  describe('getCalorieColor', () => {
    it('should return green for low calories', () => {
      expect(getCalorieColor(50)).toBe('#4CAF50');
      expect(getCalorieColor(99)).toBe('#4CAF50');
    });

    it('should return yellow for medium calories', () => {
      expect(getCalorieColor(150)).toBe('#FFC107');
      expect(getCalorieColor(299)).toBe('#FFC107');
    });

    it('should return red for high calories', () => {
      expect(getCalorieColor(300)).toBe('#F44336');
      expect(getCalorieColor(500)).toBe('#F44336');
    });
  });
});
