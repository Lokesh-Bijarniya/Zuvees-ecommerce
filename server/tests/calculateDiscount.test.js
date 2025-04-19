const calculateDiscount = require('../utils/calculateDiscount');

describe('calculateDiscount (unit test)', () => {
  it('should calculate correct price after discount', () => {
    expect(calculateDiscount(1000, 10)).toBe(900);
    expect(calculateDiscount(500, 20)).toBe(400);
    expect(calculateDiscount(200, 0)).toBe(200);
    expect(calculateDiscount(100, 100)).toBe(0);
  });

  it('should throw error for invalid arguments', () => {
    expect(() => calculateDiscount('100', 10)).toThrow('Invalid arguments');
    expect(() => calculateDiscount(100, '10')).toThrow('Invalid arguments');
  });

  it('should throw error for discount percent out of range', () => {
    expect(() => calculateDiscount(100, -5)).toThrow('Discount percent must be between 0 and 100');
    expect(() => calculateDiscount(100, 150)).toThrow('Discount percent must be between 0 and 100');
  });
});
