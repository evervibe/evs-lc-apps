import { describe, it, expect } from 'vitest';
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  calculateTotal,
  recalculateCart,
  clearCart,
  validateCart,
  type Cart,
  type CartItem,
} from '../shop';

describe('Shop Logic', () => {
  describe('addToCart', () => {
    it('should add new item to empty cart', () => {
      const cart: Cart = { items: [], totalAmount: 0 };
      const item: CartItem = {
        productId: 'prod_1',
        name: 'Test Product',
        price: 10,
        quantity: 1,
        stock: 100,
        category: 'test',
        description: 'Test',
      };
      
      const result = addToCart(cart, item);
      
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(item);
    });

    it('should increase quantity if item already in cart', () => {
      const cart: Cart = {
        items: [{
          productId: 'prod_1',
          name: 'Test Product',
          price: 10,
          quantity: 1,
          stock: 100,
          category: 'test',
          description: 'Test',
        }],
        totalAmount: 10,
      };
      
      const item: CartItem = {
        productId: 'prod_1',
        name: 'Test Product',
        price: 10,
        quantity: 2,
        stock: 100,
        category: 'test',
        description: 'Test',
      };
      
      const result = addToCart(cart, item);
      
      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(3);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', () => {
      const cart: Cart = {
        items: [
          {
            productId: 'prod_1',
            name: 'Test Product 1',
            price: 10,
            quantity: 1,
            stock: 100,
            category: 'test',
            description: 'Test',
          },
          {
            productId: 'prod_2',
            name: 'Test Product 2',
            price: 20,
            quantity: 1,
            stock: 100,
            category: 'test',
            description: 'Test',
          },
        ],
        totalAmount: 30,
      };
      
      const result = removeFromCart(cart, 'prod_1');
      
      expect(result.items).toHaveLength(1);
      expect(result.items[0].productId).toBe('prod_2');
    });
  });

  describe('updateCartItemQuantity', () => {
    it('should update item quantity', () => {
      const cart: Cart = {
        items: [{
          productId: 'prod_1',
          name: 'Test Product',
          price: 10,
          quantity: 1,
          stock: 100,
          category: 'test',
          description: 'Test',
        }],
        totalAmount: 10,
      };
      
      const result = updateCartItemQuantity(cart, 'prod_1', 5);
      
      expect(result.items[0].quantity).toBe(5);
    });

    it('should remove item if quantity is 0 or less', () => {
      const cart: Cart = {
        items: [{
          productId: 'prod_1',
          name: 'Test Product',
          price: 10,
          quantity: 1,
          stock: 100,
          category: 'test',
          description: 'Test',
        }],
        totalAmount: 10,
      };
      
      const result = updateCartItemQuantity(cart, 'prod_1', 0);
      
      expect(result.items).toHaveLength(0);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate correct total', () => {
      const cart: Cart = {
        items: [
          {
            productId: 'prod_1',
            name: 'Test Product 1',
            price: 10,
            quantity: 2,
            stock: 100,
            category: 'test',
            description: 'Test',
          },
          {
            productId: 'prod_2',
            name: 'Test Product 2',
            price: 15,
            quantity: 3,
            stock: 100,
            category: 'test',
            description: 'Test',
          },
        ],
        totalAmount: 0,
      };
      
      const total = calculateTotal(cart);
      
      expect(total).toBe(65); // 10*2 + 15*3 = 20 + 45 = 65
    });

    it('should return 0 for empty cart', () => {
      const cart: Cart = { items: [], totalAmount: 0 };
      
      const total = calculateTotal(cart);
      
      expect(total).toBe(0);
    });
  });

  describe('recalculateCart', () => {
    it('should update totalAmount based on items', () => {
      const cart: Cart = {
        items: [
          {
            productId: 'prod_1',
            name: 'Test Product',
            price: 10,
            quantity: 3,
            stock: 100,
            category: 'test',
            description: 'Test',
          },
        ],
        totalAmount: 0,
      };
      
      const result = recalculateCart(cart);
      
      expect(result.totalAmount).toBe(30);
    });
  });

  describe('clearCart', () => {
    it('should return empty cart', () => {
      const result = clearCart();
      
      expect(result.items).toHaveLength(0);
      expect(result.totalAmount).toBe(0);
    });
  });

  describe('validateCart', () => {
    it('should validate cart successfully', () => {
      const cart: Cart = {
        items: [{
          productId: 'prod_1',
          name: 'Test Product',
          price: 10,
          quantity: 1,
          stock: 100,
          category: 'test',
          description: 'Test',
        }],
        totalAmount: 10,
      };
      
      const result = validateCart(cart);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for empty cart', () => {
      const cart: Cart = { items: [], totalAmount: 0 };
      
      const result = validateCart(cart);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Cart is empty');
    });

    it('should fail validation for invalid quantity', () => {
      const cart: Cart = {
        items: [{
          productId: 'prod_1',
          name: 'Test Product',
          price: 10,
          quantity: -1,
          stock: 100,
          category: 'test',
          description: 'Test',
        }],
        totalAmount: 10,
      };
      
      const result = validateCart(cart);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail validation for invalid price', () => {
      const cart: Cart = {
        items: [{
          productId: 'prod_1',
          name: 'Test Product',
          price: -10,
          quantity: 1,
          stock: 100,
          category: 'test',
          description: 'Test',
        }],
        totalAmount: 10,
      };
      
      const result = validateCart(cart);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
