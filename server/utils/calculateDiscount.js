// utils/calculateDiscount.js

/**
 * Calculates the final price after applying a discount percentage.
 * @param {number} price - The original price
 * @param {number} discountPercent - The discount percentage (0-100)
 * @returns {number} The price after discount
 */
function calculateDiscount(price, discountPercent) {
  if (typeof price !== 'number' || typeof discountPercent !== 'number') {
    throw new Error('Invalid arguments');
  }
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percent must be between 0 and 100');
  }
  return price - (price * (discountPercent / 100));
}

module.exports = calculateDiscount;
