import { nutritionDatabase } from '../src/utils/nutritionDatabase';

describe('Nutrition Database', () => {
  it('should contain food items', () => {
    expect(Object.keys(nutritionDatabase).length).toBeGreaterThan(0);
  });

  it('should have correct structure for each food', () => {
    const apple = nutritionDatabase.apple;
    expect(apple).toBeDefined();
    expect(apple.name).toBeDefined();
    expect(apple.calories).toBeDefined();
    expect(apple.protein).toBeDefined();
    expect(apple.carbs).toBeDefined();
    expect(apple.fat).toBeDefined();
    expect(apple.servingSize).toBeDefined();
  });

  it('should have numeric values for nutrition data', () => {
    const apple = nutritionDatabase.apple;
    expect(typeof apple.calories).toBe('number');
    expect(typeof apple.protein).toBe('number');
    expect(typeof apple.carbs).toBe('number');
    expect(typeof apple.fat).toBe('number');
  });
});
